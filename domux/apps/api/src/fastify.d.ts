import "fastify";
import "@fastify/jwt";
import { AppRole } from "./types";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: any, reply: any) => Promise<any>;
    requireTenant: (request: any, reply: any) => Promise<any>;
    authorize: (
      ...roles: AppRole[]
    ) => (request: any, reply: any) => Promise<any>;
  }

  interface FastifyRequest {
    tenantId?: string;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string;
      email: string;
      role: string;
      tenantId: string | null;
    };
  }
}
