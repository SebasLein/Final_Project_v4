import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { config } from '../config';
import { AppRole, AuthUser } from '../types';

/**
 * Registra JWT y expone dos decorators:
 * - authenticate: valida el access token y llena request.authUser
 * - authorize(...roles): debe usarse DESPUÉS de authenticate; rechaza si el
 *   rol del usuario autenticado no está en la lista permitida.
 */
export default fp(async (app) => {
  await app.register(jwt, { secret: config.accessSecret });

  app.decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
      request.authUser = request.user as AuthUser;
    } catch {
      return reply.code(401).send({ message: 'No autorizado' });
    }
  });

  app.decorate('authorize', (...roles: AppRole[]) => {
    return async (request: any, reply: any) => {
      const authUser: AuthUser | undefined = request.authUser;
      if (!authUser || !roles.includes(authUser.role)) {
        return reply.code(403).send({ message: 'No tienes permisos para esta acción' });
      }
    };
  });
});
