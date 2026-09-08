import { prisma } from "../lib/prisma";
import { recordAudit } from "../lib/audit";
import { ConflictError, NotFoundError } from "../lib/errors";
import { AuthUser } from "../types";
import { CreateUnitInput } from "../schemas/units.schema";

export type UpdateUnitInput = Partial<CreateUnitInput>;

export async function listUnits(tenantId: string) {
  return prisma.unit.findMany({
    where: { tenantId },
    include: {
      residents: {
        select: { id: true, name: true, email: true, role: true, active: true },
      },
    },
    orderBy: { code: "asc" },
  });
}

export async function getUnitById(actor: AuthUser, unitId: string) {
  const tenantId = actor.tenantId as string;
  const unit = await prisma.unit.findFirst({
    where: { id: unitId, tenantId },
    include: {
      residents: {
        select: { id: true, name: true, email: true, role: true, active: true },
      },
    },
  });
  if (!unit) throw new NotFoundError("Unidad no encontrada");
  return unit;
}

export async function createUnit(actor: AuthUser, input: CreateUnitInput) {
  const tenantId = actor.tenantId as string;
  const existing = await prisma.unit.findUnique({
    where: { tenantId_code: { tenantId, code: input.code } },
  });
  if (existing)
    throw new ConflictError(
      "Ya existe una unidad con ese código en esta propiedad",
    );

  const unit = await prisma.unit.create({
    data: { tenantId, code: input.code },
  });
  await recordAudit({
    userId: actor.sub,
    tenantId,
    action: "UNIT_CREATED",
    entity: "UNIT",
    metadata: unit,
  });
  return unit;
}

export async function updateUnit(
  actor: AuthUser,
  unitId: string,
  input: UpdateUnitInput,
) {
  const tenantId = actor.tenantId as string;
  const unit = await prisma.unit.findFirst({ where: { id: unitId, tenantId } });
  if (!unit) throw new NotFoundError("Unidad no encontrada");

  if (input.code && input.code !== unit.code) {
    const existingCode = await prisma.unit.findUnique({
      where: { tenantId_code: { tenantId, code: input.code } },
    });
    if (existingCode)
      throw new ConflictError(
        "Ya existe una unidad con ese código en esta propiedad",
      );
  }

  const updated = await prisma.unit.update({
    where: { id: unitId },
    data: input,
  });

  await recordAudit({
    userId: actor.sub,
    tenantId,
    action: "UNIT_UPDATED",
    entity: "UNIT",
    metadata: { unitId, ...input },
  });

  return updated;
}

export async function deleteUnit(actor: AuthUser, unitId: string) {
  const tenantId = actor.tenantId as string;
  const unit = await prisma.unit.findFirst({
    where: { id: unitId, tenantId },
    include: {
      _count: { select: { residents: true, visitors: true, packages: true } },
    },
  });

  if (!unit) throw new NotFoundError("Unidad no encontrada");

  if (
    unit._count.residents > 0 ||
    unit._count.visitors > 0 ||
    unit._count.packages > 0
  ) {
    throw new ConflictError(
      "No se puede eliminar la unidad porque tiene registros asociados",
    );
  }

  await prisma.unit.delete({ where: { id: unitId } });

  await recordAudit({
    userId: actor.sub,
    tenantId,
    action: "UNIT_DELETED",
    entity: "UNIT",
    metadata: { unitId, code: unit.code },
  });

  return { message: "Unidad eliminada correctamente" };
}
