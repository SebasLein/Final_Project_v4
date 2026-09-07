import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import './types';
import { config } from './config';
import authPlugin from './plugins/auth';
import tenantScopePlugin from './plugins/tenantScope';
import { healthRoutes } from './routes/health';
import { authRoutes } from './routes/auth.routes';
import { tenantsRoutes } from './routes/tenants.routes';
import { usersRoutes } from './routes/users.routes';
import { unitsRoutes } from './routes/units.routes';
import { visitorsRoutes } from './routes/visitors.routes';
import { packagesRoutes } from './routes/packages.routes';
import { commonAreasRoutes } from './routes/commonAreas.routes';
import { reservationsRoutes } from './routes/reservations.routes';
import { noticesRoutes } from './routes/notices.routes';
import { dashboardRoutes } from './routes/dashboard.routes';
import { AppError } from './lib/errors';

const app = Fastify({ logger: true });

async function build() {
  await app.register(cors, { origin: config.webUrl, credentials: true });
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(rateLimit, { max: 150, timeWindow: '1 minute' });
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'DOMUX API',
        version: '1.0.0',
        description:
          'API REST de DOMUX 1.0 — gestión de propiedad horizontal multi-tenant (SUPERADMIN, ADMIN, GATEKEEPER, RESIDENT). Ver docs/api.md en el repositorio para el detalle de cada endpoint.'
      }
    }
  });
  await app.register(swaggerUi, { routePrefix: '/docs' });

  await app.register(authPlugin);
  await app.register(tenantScopePlugin);

  await healthRoutes(app);
  await authRoutes(app);
  await tenantsRoutes(app);
  await usersRoutes(app);
  await unitsRoutes(app);
  await visitorsRoutes(app);
  await packagesRoutes(app);
  await commonAreasRoutes(app);
  await reservationsRoutes(app);
  await noticesRoutes(app);
  await dashboardRoutes(app);

  app.get('/', async () => ({ service: 'DOMUX API', status: 'up', version: '1.0.0' }));

  // Manejador de errores centralizado: nunca se filtran stack traces ni detalles internos.
  app.setErrorHandler((error: Error, request, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message });
    }
    // Errores de validación propios de Fastify (payload malformado, etc.)
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode && statusCode < 500) {
      return reply.code(statusCode).send({ message: error.message });
    }
    request.log.error(error);
    return reply.code(500).send({ message: 'Error interno del servidor' });
  });

  return app;
}

build().then((builtApp) => {
  builtApp.listen({ port: config.port, host: '0.0.0.0' }).then(() => {
    console.log(`DOMUX API escuchando en http://localhost:${config.port}`);
    console.log(`Swagger docs en http://localhost:${config.port}/docs`);
  });
});
