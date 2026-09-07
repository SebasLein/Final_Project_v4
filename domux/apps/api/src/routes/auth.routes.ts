import { FastifyInstance } from 'fastify';
import { loginHandler, refreshHandler } from '../controllers/auth.controller';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', loginHandler);
  app.post('/auth/refresh', refreshHandler);
}
