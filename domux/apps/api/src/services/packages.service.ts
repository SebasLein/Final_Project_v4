import { prisma } from "../lib/prisma";
import { recordAudit } from "../lib/audit";
import { AppError, ConflictError, NotFoundError } from "../lib/errors";
import { AuthUser } from "../types";
import {
  PackageFilters,
  RegisterPackageInput,
} from "../schemas/packages.schema";

export async function registerPackage(
  actor: AuthUser,
  input: RegisterPackageInput,
) {
  const tenantId = actor.tenantId as string;

  const unit = await prisma.unit.findUnique({
    where: { tenantId_code: { tenantId, code: input.unitCode } },
  });
  if (!unit) throw new NotFoundError("Unidad no encontrada");

  const pkg = await prisma.package.create({
    data: {
      tenantId,
      unitId: unit.id,
      recipient: input.recipient,
      courier: (input as any).courier ?? null,
      status: "PENDING",
      registeredById: actor.sub,
    },
  });

  await recordAudit({
    userId: actor.sub,
    tenantId,
    action: "PACKAGE_REGISTERED",
    entity: "PACKAGE",
    metadata: { packageId: pkg.id, unitCode: input.unitCode },
  });

  return pkg;
}

export async function markDelivered(actor: AuthUser, packageId: string) {
  const tenantId = actor.tenantId as string;

  const pkg = await prisma.package.findFirst({
    where: { id: packageId, tenantId },
  });

  if (!pkg) throw new NotFoundError("Paquete no encontrado");
  if (pkg.status !== "PENDING")
    throw new ConflictError("El paquete ya fue entregado previamente");

  const updated = await prisma.package.update({
    where: { id: packageId },
    data: {
      status: "DELIVERED",
      deliveredAt: new Date(),
      deliveredById: actor.sub,
    },
  });

  await recordAudit({
    userId: actor.sub,
    tenantId,
    action: "PACKAGE_DELIVERED",
    entity: "PACKAGE",
    metadata: { packageId },
  });

  return updated;
}

export async function listPackages(actor: AuthUser, filters: PackageFilters) {
  const tenantId = actor.tenantId as string;

  if (actor.role === "RESIDENT") {
    const resident = await prisma.user.findUnique({ where: { id: actor.sub } });
    if (!resident?.unitId)
      throw new AppError("El residente no tiene una unidad asignada", 403);

    return prisma.package.findMany({
      where: {
        tenantId,
        unitId: resident.unitId,
        status: filters.status,
      },
      include: { unit: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Extraer unitCode con casteo de tipo seguro para evitar el error de TypeScript
  const rawFilters = filters as PackageFilters & { unitCode?: string };
  const unitFilter = rawFilters.unitCode
    ? { unit: { code: rawFilters.unitCode } }
    : {};

  return prisma.package.findMany({
    where: {
      tenantId,
      status: filters.status,
      ...unitFilter,
    },
    include: { unit: true },
    orderBy: { createdAt: "desc" },
  });
}
