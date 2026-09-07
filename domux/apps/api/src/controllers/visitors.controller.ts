import { FastifyReply, FastifyRequest } from 'fastify';
import { parseOrThrow } from '../lib/validate';
import {
  authorizeVisitorSchema,
  registerVisitorManuallySchema,
  visitorFiltersSchema
} from '../schemas/visitors.schema';
import * as visitorsService from '../services/visitors.service';

export async function listVisitorsHandler(request: FastifyRequest, reply: FastifyReply) {
  const filters = parseOrThrow(visitorFiltersSchema, request.query);
  const visitors = await visitorsService.listVisitors(request.authUser!, filters);
  return reply.send(visitors);
}

export async function authorizeVisitorHandler(request: FastifyRequest, reply: FastifyReply) {
  const input = parseOrThrow(authorizeVisitorSchema, request.body);
  const visitor = await visitorsService.authorizeVisitor(request.authUser!, input);
  return reply.code(201).send(visitor);
}

export async function registerVisitorManuallyHandler(request: FastifyRequest, reply: FastifyReply) {
  const input = parseOrThrow(registerVisitorManuallySchema, request.body);
  const visitor = await visitorsService.registerVisitorManually(request.authUser!, input);
  return reply.code(201).send(visitor);
}

export async function cancelVisitorHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const visitor = await visitorsService.cancelVisitor(request.authUser!, id);
  return reply.send(visitor);
}

export async function registerEntryHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const visitor = await visitorsService.registerEntry(request.authUser!, id);
  return reply.send(visitor);
}

export async function registerExitHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const visitor = await visitorsService.registerExit(request.authUser!, id);
  return reply.send(visitor);
}
