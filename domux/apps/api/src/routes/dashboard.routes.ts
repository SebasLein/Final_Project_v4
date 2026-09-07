import { FastifyInstance } from 'fastify';
import { dashboardSummaryHandler } from '../controllers/dashboard.controller';

export async function dashboardRoutes(app: FastifyInstance) {
  const guard = [app.authenticate, app.requireTenant, app.authorize('SUPERADMIN', 'ADMIN')];
  app.get('/dashboard/summary', { preHandler: guard }, dashboardSummaryHandler);
}
