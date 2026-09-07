import { FastifyInstance } from 'fastify';
import { createUnitHandler, listUnitsHandler } from '../controllers/units.controller';

export async function unitsRoutes(app: FastifyInstance) {
  const guard = [app.authenticate, app.authorize('ADMIN'), app.requireTenant];

  app.get('/units', { preHandler: guard }, listUnitsHandler);
  app.post('/units', { preHandler: guard }, createUnitHandler);
}
