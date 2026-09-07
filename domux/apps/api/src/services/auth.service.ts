import bcrypt from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import { prisma } from '../lib/prisma';
import { recordAudit } from '../lib/audit';
import { AppError } from '../lib/errors';
import { config } from '../config';
import { LoginInput } from '../schemas/auth.schema';

const REFRESH_HASH_ROUNDS = 10;

function buildPayload(user: { id: string; email: string; role: string; tenantId: string | null }) {
  return { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId };
}

export async function login(app: FastifyInstance, input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.active) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const validPassword = await bcrypt.compare(input.password, user.passwordHash);
  if (!validPassword) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const payload = buildPayload(user);
  const accessToken = await app.jwt.sign(payload, { expiresIn: config.accessTtl });
  const refreshToken = await app.jwt.sign(payload, { expiresIn: config.refreshTtl });
  const refreshTokenHash = await bcrypt.hash(refreshToken, REFRESH_HASH_ROUNDS);

  await prisma.user.update({ where: { id: user.id }, data: { refreshTokenHash } });
  await recordAudit({
    tenantId: user.tenantId,
    userId: user.id,
    action: 'LOGIN_SUCCESS',
    entity: 'AUTH'
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, tenantId: user.tenantId }
  };
}

export async function refresh(app: FastifyInstance, refreshToken: string) {
  let decoded: { sub: string };
  try {
    decoded = (await app.jwt.verify(refreshToken)) as { sub: string };
  } catch {
    throw new AppError('Refresh token expirado o inválido', 401);
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
  if (!user || !user.active || !user.refreshTokenHash) {
    throw new AppError('Refresh token inválido', 401);
  }

  const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!matches) {
    throw new AppError('Refresh token inválido', 401);
  }

  const payload = buildPayload(user);
  const accessToken = await app.jwt.sign(payload, { expiresIn: config.accessTtl });
  return { accessToken };
}
