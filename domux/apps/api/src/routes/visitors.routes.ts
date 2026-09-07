import { FastifyInstance } from 'fastify';
import {
  authorizeVisitorHandler,
  cancelVisitorHandler,
  listVisitorsHandler,
  registerEntryHandler,
  registerExitHandler,
  registerVisitorManuallyHandler
} from '../controllers/visitors.controller';

export async function visitorsRoutes(app: FastifyInstance) {
  const base = [app.authenticate, app.requireTenant];
  const readGuard = [...base, app.authorize('ADMIN', 'GATEKEEPER', 'RESIDENT')];
  const residentGuard = [...base, app.authorize('RESIDENT')];
  const gatekeeperGuard = [...base, app.authorize('GATEKEEPER')];

  app.get('/visitors', { preHandler: readGuard }, listVisitorsHandler);
  app.post('/visitors/authorize', { preHandler: residentGuard }, authorizeVisitorHandler);
  app.patch('/visitors/:id/cancel', { preHandler: residentGuard }, cancelVisitorHandler);
  app.post('/visitors/manual', { preHandler: gatekeeperGuard }, registerVisitorManuallyHandler);
  app.patch('/visitors/:id/entry', { preHandler: gatekeeperGuard }, registerEntryHandler);
  app.patch('/visitors/:id/exit', { preHandler: gatekeeperGuard }, registerExitHandler);
}
