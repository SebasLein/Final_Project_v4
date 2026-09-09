import { FastifyReply, FastifyRequest } from "fastify";
import { parseOrThrow } from "../lib/validate";
import { loginSchema, refreshSchema } from "../schemas/auth.schema";
import * as authService from "../services/auth.service";

export async function loginHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const input = parseOrThrow(loginSchema, request.body);
  const result = await authService.login(request.server, input);
  return reply.code(200).send(result);
}

export async function refreshHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const input = parseOrThrow(refreshSchema, request.body);
  const result = await authService.refresh(request.server, input.refreshToken);
  return reply.code(200).send(result);
}

export async function logoutHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.id;
  const tenantId = request.user.tenantId ?? null;

  const result = await authService.logout(userId, tenantId);
  return reply.code(200).send(result);
}
