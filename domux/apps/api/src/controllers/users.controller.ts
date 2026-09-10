import { FastifyReply, FastifyRequest } from "fastify";
import { parseOrThrow } from "../lib/validate";
import {
  createAdminSchema,
  createTenantUserSchema,
  updateUserActiveSchema,
} from "../schemas/users.schema";
import * as usersService from "../services/users.service";

export async function listAdminsHandler(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const admins = await usersService.listAdmins();
  return reply.send(admins);
}

export async function createAdminHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const input = parseOrThrow(createAdminSchema, request.body);
  const admin = await usersService.createAdmin(request.authUser!, input);
  return reply.code(201).send(admin);
}

export async function setUserActiveHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const input = parseOrThrow(updateUserActiveSchema, request.body);
  const user = await usersService.setUserActive(request.authUser!, id, input);
  return reply.send(user);
}

export async function createTenantUserHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const input = parseOrThrow(createTenantUserSchema, request.body);
  const user = await usersService.createTenantUser(request.authUser!, input);
  return reply.code(201).send(user);
}

export async function listTenantUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const users = await usersService.listTenantUsers(request.authUser!);
  return reply.send(users);
}
