import { FastifyInstance } from 'fastify';
import {
  createCommonAreaHandler,
  listCommonAreasHandler,
  updateCommonAreaHandler
} from '../controllers/commonAreas.controller';

export async function commonAreasRoutes(app: FastifyInstance) {
  const base = [app.authenticate, app.requireTenant];
  const readGuard = [...base, app.authorize('ADMIN', 'RESIDENT')];
  const adminGuard = [...base, app.authorize('ADMIN')];

  app.get('/common-areas', { preHandler: readGuard }, listCommonAreasHandler);
  app.post('/common-areas', { preHandler: adminGuard }, createCommonAreaHandler);
  app.patch('/common-areas/:id', { preHandler: adminGuard }, updateCommonAreaHandler);
}
