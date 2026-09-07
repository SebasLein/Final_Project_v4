import { FastifyInstance } from 'fastify';
import {
  cancelReservationHandler,
  createReservationHandler,
  listReservationsHandler
} from '../controllers/reservations.controller';

export async function reservationsRoutes(app: FastifyInstance) {
  const base = [app.authenticate, app.requireTenant];
  const readGuard = [...base, app.authorize('ADMIN', 'RESIDENT')];
  const residentGuard = [...base, app.authorize('RESIDENT')];

  app.get('/reservations', { preHandler: readGuard }, listReservationsHandler);
  app.post('/reservations', { preHandler: residentGuard }, createReservationHandler);
  app.patch('/reservations/:id/cancel', { preHandler: residentGuard }, cancelReservationHandler);
}
