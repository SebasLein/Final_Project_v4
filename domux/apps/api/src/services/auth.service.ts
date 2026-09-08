import bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { recordAudit } from "../lib/audit";
import { AppError } from "../lib/errors";
import { config } from "../config";
import { LoginInput } from "../schemas/auth.schema";

const REFRESH_HASH_ROUNDS = 10;

function buildPayload(user: {
  id: string;
  email: string;
  role: string;
  tenantId: string | null;
}) {
  return {
    sub: user.id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
  };
}

export async function login(app: FastifyInstance, input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.active) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const validPassword = await bcrypt.compare(input.password, user.passwordHash);
  if (!validPassword) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const payload = buildPayload(user);
  const accessToken = await app.jwt.sign(payload, {
    expiresIn: config.accessTtl,
  });
  const refreshToken = await app.jwt.sign(payload, {
    expiresIn: config.refreshTtl,
  });
  const refreshTokenHash = await bcrypt.hash(refreshToken, REFRESH_HASH_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash },
  });

  await recordAudit({
    tenantId: user.tenantId,
    userId: user.id,
    action: "LOGIN_SUCCESS",
    entity: "AUTH",
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    },
  };
}

export async function refresh(app: FastifyInstance, refreshToken: string) {
  let decoded: { sub: string };
  try {
    decoded = (await app.jwt.verify(refreshToken)) as { sub: string };
  } catch {
    throw new AppError("Refresh token expirado o inválido", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
  if (!user || !user.active || !user.refreshTokenHash) {
    throw new AppError("Refresh token inválido o sesión revocada", 401);
  }

  const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!matches) {
    // Si la contraseña/token no coincide pero el ID existe, posible reuso malicioso: invalidar sesión por seguridad
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: null },
    });
    throw new AppError("Refresh token inválido", 401);
  }

  // MEJORA: Rotación de Refresh Token para máxima seguridad
  const payload = buildPayload(user);
  const newAccessToken = await app.jwt.sign(payload, {
    expiresIn: config.accessTtl,
  });
  const newRefreshToken = await app.jwt.sign(payload, {
    expiresIn: config.refreshTtl,
  });
  const newRefreshTokenHash = await bcrypt.hash(
    newRefreshToken,
    REFRESH_HASH_ROUNDS,
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokenHash: newRefreshTokenHash },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logout(userId: string, tenantId: string | null) {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshTokenHash: null },
  });

  await recordAudit({
    tenantId,
    userId,
    action: "LOGOUT_SUCCESS",
    entity: "AUTH",
  });

  return { message: "Sesión cerrada correctamente" };
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      unit: true,
      tenantId: true,
      active: true,
    },
  });

  if (!user || !user.active) {
    throw new AppError("Usuario no encontrado o inactivo", 404);
  }

  return user;
}
