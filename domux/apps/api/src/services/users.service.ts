import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { recordAudit } from "../lib/audit";
import { AppError, ConflictError, NotFoundError } from "../lib/errors";
import { AuthUser } from "../types";
import {
  CreateAdminInput,
  CreateTenantUserInput,
  UpdateUserActiveInput,
} from "../schemas/users.schema";

const PASSWORD_ROUNDS = 10;

async function assertUniqueEmail(email: string, excludeUserId?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== excludeUserId) {
    throw new ConflictError("Ya existe un usuario con ese correo");
  }
}

export async function listAdmins() {
  return prisma.user.findMany({
    where: { role: "ADMIN" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      tenant: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createAdmin(actor: AuthUser, input: CreateAdminInput) {
  await assertUniqueEmail(input.email);

  const tenant = await prisma.tenant.findUnique({
    where: { id: input.tenantId },
  });
  if (!tenant) throw new NotFoundError("Propiedad no encontrada");

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_ROUNDS);
  const admin = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: "ADMIN",
      tenantId: tenant.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      tenantId: true,
      createdAt: true,
    },
  });

  await recordAudit({
    userId: actor.sub,
    tenantId: tenant.id,
    action: "ADMIN_CREATED",
    entity: "USER",
    metadata: { userId: admin.id, email: admin.email },
  });

  return admin;
}

export async function setUserActive(
  actor: AuthUser,
  userId: string,
  input: UpdateUserActiveInput,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { active: input.active },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      tenantId: true,
    },
  });

  await recordAudit({
    userId: actor.sub,
    tenantId: user.tenantId,
    action: input.active ? "USER_ACTIVATED" : "USER_DEACTIVATED",
    entity: "USER",
    metadata: { userId },
  });

  return updated;
}

/** ADMIN crea GATEKEEPER o RESIDENT dentro de su propia propiedad. */
export async function createTenantUser(
  actor: AuthUser,
  input: CreateTenantUserInput,
) {
  if (!actor.tenantId)
    throw new AppError(
      "El usuario autenticado no tiene propiedad asociada",
      403,
    );
  await assertUniqueEmail(input.email);

  if (input.unitId) {
    const unit = await prisma.unit.findFirst({
      where: { id: input.unitId, tenantId: actor.tenantId },
    });
    if (!unit)
      throw new NotFoundError("Unidad no encontrada en esta propiedad");
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      tenantId: actor.tenantId,
      unitId: input.unitId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      tenantId: true,
      unitId: true,
      createdAt: true,
    },
  });

  await recordAudit({
    userId: actor.sub,
    tenantId: actor.tenantId,
    action: "TENANT_USER_CREATED",
    entity: "USER",
    metadata: { userId: user.id, role: user.role },
  });

  return user;
}

export async function listTenantUsers(actor: AuthUser) {
  if (!actor.tenantId)
    throw new AppError(
      "El usuario autenticado no tiene propiedad asociada",
      403,
    );
  return prisma.user.findMany({
    where: {
      tenantId: actor.tenantId,
      role: { in: ["GATEKEEPER", "RESIDENT"] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      unit: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
