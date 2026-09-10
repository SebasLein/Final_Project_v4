import { prisma } from "../lib/prisma";
import { recordAudit } from "../lib/audit";
import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../lib/errors";
import { AuthUser } from "../types";
import {
  AuthorizeVisitorInput,
  RegisterVisitorManuallyInput,
  VisitorFilters,
} from "../schemas/visitors.schema";

/** RESIDENT autoriza un visitante para su propia unidad. */
export async function authorizeVisitor(
  actor: AuthUser,
  input: AuthorizeVisitorInput,
) {
  const resident = await prisma.user.findUnique({ where: { id: actor.sub } });
  if (!resident?.unitId) {
    throw new AppError("El residente no tiene una unidad asignada", 403);
  }

  // Validar que el visitante no esté actualmente dentro de la propiedad
  const activeVisitor = await prisma.visitor.findFirst({
    where: {
      tenantId: actor.tenantId as string,
      documentId: input.documentId,
      status: "ENTERED",
    },
  });

  if (activeVisitor) {
    throw new ConflictError(
      "El visitante con este documento ya se encuentra dentro de la propiedad",
    );
  }

  const visitor = await prisma.visitor.create({
    data: {
      tenantId: actor.tenantId as string,
      unitId: resident.unitId,
      fullName: input.fullName,
      documentId: input.documentId,
      type: input.type,
      status: "AUTHORIZED",
      authorizedById: actor.sub,
    },
  });

  await recordAudit({
    userId: actor.sub,
    tenantId: actor.tenantId,
    action: "VISITOR_AUTHORIZED",
    entity: "VISITOR",
    metadata: { visitorId: visitor.id },
  });

  return visitor;
}

/** RESIDENT cancela una autorización que él mismo creó, antes del ingreso. */
export async function cancelVisitor(actor: AuthUser, visitorId: string) {
  const visitor = await prisma.visitor.findFirst({
    where: { id: visitorId, tenantId: actor.tenantId as string },
  });
  if (!visitor) throw new NotFoundError("Visitante no encontrado");
  if (visitor.authorizedById !== actor.sub)
    throw new ForbiddenError("Solo puedes cancelar tus propias autorizaciones");
  if (visitor.status !== "AUTHORIZED")
    throw new ConflictError(
      "Solo se pueden cancelar visitantes en estado AUTHORIZED",
    );

  const updated = await prisma.visitor.update({
    where: { id: visitorId },
    data: { status: "CANCELLED" },
  });
  await recordAudit({
    userId: actor.sub,
    tenantId: actor.tenantId,
    action: "VISITOR_CANCELLED",
    entity: "VISITOR",
    metadata: { visitorId },
  });
  return updated;
}

/** GATEKEEPER registra un visitante que llega sin autorización previa de un residente. */
export async function registerVisitorManually(
  actor: AuthUser,
  input: RegisterVisitorManuallyInput,
) {
  const unit = await prisma.unit.findUnique({
    where: {
      tenantId_code: {
        tenantId: actor.tenantId as string,
        code: input.unitCode,
      },
    },
  });
  if (!unit) throw new NotFoundError("Unidad no encontrada");

  // Validar que no haya un registro del mismo documento ya en estado ENTERED
  const activeVisitor = await prisma.visitor.findFirst({
    where: {
      tenantId: actor.tenantId as string,
      documentId: input.documentId,
      status: "ENTERED",
    },
  });

  if (activeVisitor) {
    throw new ConflictError(
      "El visitante ya tiene un ingreso registrado sin salida previa",
    );
  }

  const visitor = await prisma.visitor.create({
    data: {
      tenantId: actor.tenantId as string,
      unitId: unit.id,
      fullName: input.fullName,
      documentId: input.documentId,
      type: input.type,
      status: "ENTERED",
      authorizedById: actor.sub,
      registeredById: actor.sub,
      entryAt: new Date(),
    },
  });

  await recordAudit({
    userId: actor.sub,
    tenantId: actor.tenantId,
    action: "VISITOR_MANUAL_REGISTER",
    entity: "VISITOR",
    metadata: { visitorId: visitor.id },
  });

  return visitor;
}

export async function registerEntry(actor: AuthUser, visitorId: string) {
  const visitor = await prisma.visitor.findFirst({
    where: { id: visitorId, tenantId: actor.tenantId as string },
  });
  if (!visitor) throw new NotFoundError("Visitante no encontrado");
  if (visitor.status !== "AUTHORIZED")
    throw new ConflictError("El visitante no está en estado AUTHORIZED");

  const updated = await prisma.visitor.update({
    where: { id: visitorId },
    data: { status: "ENTERED", entryAt: new Date(), registeredById: actor.sub },
  });

  await recordAudit({
    userId: actor.sub,
    tenantId: actor.tenantId,
    action: "VISITOR_ENTRY",
    entity: "VISITOR",
    metadata: { visitorId },
  });
  return updated;
}

export async function registerExit(actor: AuthUser, visitorId: string) {
  const visitor = await prisma.visitor.findFirst({
    where: { id: visitorId, tenantId: actor.tenantId as string },
  });
  if (!visitor) throw new NotFoundError("Visitante no encontrado");
  if (visitor.status !== "ENTERED")
    throw new ConflictError("El visitante no está en estado ENTERED");

  const updated = await prisma.visitor.update({
    where: { id: visitorId },
    data: { status: "EXITED", exitAt: new Date() },
  });

  await recordAudit({
    userId: actor.sub,
    tenantId: actor.tenantId,
    action: "VISITOR_EXIT",
    entity: "VISITOR",
    metadata: { visitorId },
  });
  return updated;
}

/** Listado con reglas distintas por rol. */
export async function listVisitors(actor: AuthUser, filters: VisitorFilters) {
  const tenantId = actor.tenantId as string;
  const unitFilter = filters.unitCode
    ? { unit: { code: filters.unitCode } }
    : {};

  if (actor.role === "ADMIN") {
    return prisma.visitor.findMany({
      where: { tenantId, status: filters.status, ...unitFilter },
      include: { unit: true, authorizedBy: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  if (actor.role === "GATEKEEPER") {
    return prisma.visitor.findMany({
      where: {
        tenantId,
        status: filters.status ?? { in: ["AUTHORIZED", "ENTERED"] },
        ...unitFilter,
      },
      include: { unit: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // RESIDENT solo ve las autorizaciones que creó personalmente.
  return prisma.visitor.findMany({
    where: {
      tenantId,
      status: filters.status,
      authorizedById: actor.sub,
    },
    include: { unit: true },
    orderBy: { createdAt: "desc" },
  });
}
