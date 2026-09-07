import { FastifyInstance } from 'fastify';
import {
  createAdminHandler,
  createTenantUserHandler,
  listAdminsHandler,
  listTenantUsersHandler,
  setUserActiveHandler
} from '../controllers/users.controller';

export async function usersRoutes(app: FastifyInstance) {
  const superadminGuard = [app.authenticate, app.authorize('SUPERADMIN')];
  const adminGuard = [app.authenticate, app.authorize('ADMIN'), app.requireTenant];

  // Gestión de administradores (SUPERADMIN).
  app.get('/admins', { preHandler: superadminGuard }, listAdminsHandler);
  app.post('/admins', { preHandler: superadminGuard }, createAdminHandler);
  app.patch('/users/:id/active', { preHandler: superadminGuard }, setUserActiveHandler);

  // Gestión de gatekeepers/residentes dentro de la propiedad (ADMIN).
  app.get('/users', { preHandler: adminGuard }, listTenantUsersHandler);
  app.post('/users', { preHandler: adminGuard }, createTenantUserHandler);
}
