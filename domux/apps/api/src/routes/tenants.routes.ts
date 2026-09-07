import { FastifyInstance } from 'fastify';
import { createTenantHandler, listTenantsHandler, updateTenantHandler } from '../controllers/tenants.controller';

export async function tenantsRoutes(app: FastifyInstance) {
  const guard = [app.authenticate, app.authorize('SUPERADMIN')];

  app.get('/tenants', { preHandler: guard }, listTenantsHandler);
  app.post('/tenants', { preHandler: guard }, createTenantHandler);
  app.patch('/tenants/:id', { preHandler: guard }, updateTenantHandler);
}
