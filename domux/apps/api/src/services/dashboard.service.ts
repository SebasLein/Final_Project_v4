import { prisma } from "../lib/prisma";
import { AppError } from "../lib/errors";
import { AuthUser } from "../types";

export async function globalSummary() {
  const [tenants, admins, totalUsers] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count(),
  ]);
  return { scope: "global" as const, tenants, admins, totalUsers };
}

export async function tenantSummary(actor: AuthUser) {
  const tenantId = actor.tenantId as string;

  if (!tenantId) {
    throw new AppError(
      "Se requiere un ID de propiedad para obtener el resumen del panel",
      400,
    );
  }

  const [
    units,
    residents,
    activeVisitors,
    pendingPackages,
    activeReservations,
  ] = await Promise.all([
    prisma.unit.count({ where: { tenantId } }),
    prisma.user.count({ where: { tenantId, role: "RESIDENT" } }),
    // Solo se cuentan las visitas físicamente presentes
    prisma.visitor.count({ where: { tenantId, status: "ENTERED" } }),
    prisma.package.count({ where: { tenantId, status: "PENDING" } }),
    prisma.reservation.count({ where: { tenantId, status: "ACTIVE" } }),
  ]);

  return {
    scope: "tenant" as const,
    units,
    residents,
    activeVisitors,
    pendingPackages,
    activeReservations,
  };
}

export async function dashboardSummary(actor: AuthUser) {
  if (actor.role === "SUPERADMIN") return globalSummary();
  return tenantSummary(actor);
}
