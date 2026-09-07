import 'fastify';

export type AppRole = 'SUPERADMIN' | 'ADMIN' | 'GATEKEEPER' | 'RESIDENT';

export interface AuthUser {
  sub: string;
  role: AppRole;
  tenantId: string | null;
  email: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    authUser?: AuthUser;
  }
}
