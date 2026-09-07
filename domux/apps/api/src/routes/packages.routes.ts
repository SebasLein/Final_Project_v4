import { FastifyInstance } from 'fastify';
import {
  listPackagesHandler,
  markDeliveredHandler,
  registerPackageHandler
} from '../controllers/packages.controller';

export async function packagesRoutes(app: FastifyInstance) {
  const base = [app.authenticate, app.requireTenant];
  const readGuard = [...base, app.authorize('ADMIN', 'GATEKEEPER', 'RESIDENT')];
  const gatekeeperGuard = [...base, app.authorize('GATEKEEPER')];

  app.get('/packages', { preHandler: readGuard }, listPackagesHandler);
  app.post('/packages', { preHandler: gatekeeperGuard }, registerPackageHandler);
  app.patch('/packages/:id/deliver', { preHandler: gatekeeperGuard }, markDeliveredHandler);
}
