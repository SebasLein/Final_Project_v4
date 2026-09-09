import { FastifyReply, FastifyRequest } from "fastify";
import { parseOrThrow } from "../lib/validate";
import {
  createTenantSchema,
  updateTenantSchema,
} from "../schemas/tenants.schema";
import * as tenantsService from "../services/tenants.service";

export async function listTenantsHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const tenants = await tenantsService.listTenants();
  return reply.send(tenants);
}

export async function createTenantHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const input = parseOrThrow(createTenantSchema, request.body);
  const tenant = await tenantsService.createTenant(request.authUser!, input);
  return reply.code(201).send(tenant);
}

export async function updateTenantHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const input = parseOrThrow(updateTenantSchema, request.body);
  const tenant = await tenantsService.updateTenant(
    request.authUser!,
    id,
    input,
  );
  return reply.send(tenant);
}
