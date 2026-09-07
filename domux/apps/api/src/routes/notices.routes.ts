import { FastifyInstance } from 'fastify';
import { createNoticeHandler, listNoticesHandler, updateNoticeHandler } from '../controllers/notices.controller';

export async function noticesRoutes(app: FastifyInstance) {
  const base = [app.authenticate, app.requireTenant];
  const readGuard = [...base, app.authorize('ADMIN', 'GATEKEEPER', 'RESIDENT')];
  const adminGuard = [...base, app.authorize('ADMIN')];

  app.get('/notices', { preHandler: readGuard }, listNoticesHandler);
  app.post('/notices', { preHandler: adminGuard }, createNoticeHandler);
  app.patch('/notices/:id', { preHandler: adminGuard }, updateNoticeHandler);
}
