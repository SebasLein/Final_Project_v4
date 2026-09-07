import 'fastify';
import { AppRole } from './types';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<any>;
    requireTenant: (request: any, reply: any) => Promise<any>;
    authorize: (...roles: AppRole[]) => (request: any, reply: any) => Promise<any>;
  }
}
