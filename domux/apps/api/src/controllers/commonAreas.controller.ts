import { FastifyReply, FastifyRequest } from 'fastify';
import { parseOrThrow } from '../lib/validate';
import { createCommonAreaSchema, updateCommonAreaSchema } from '../schemas/commonAreas.schema';
import * as commonAreasService from '../services/commonAreas.service';

export async function listCommonAreasHandler(request: FastifyRequest, reply: FastifyReply) {
  const authUser = request.authUser!;
  // ADMIN ve todas (incluidas inactivas) para poder gestionarlas; el resto solo ve las activas.
  const onlyActive = authUser.role !== 'ADMIN';
  const areas = await commonAreasService.listCommonAreas(authUser.tenantId as string, onlyActive);
  return reply.send(areas);
}

export async function createCommonAreaHandler(request: FastifyRequest, reply: FastifyReply) {
  const input = parseOrThrow(createCommonAreaSchema, request.body);
  const area = await commonAreasService.createCommonArea(request.authUser!, input);
  return reply.code(201).send(area);
}

export async function updateCommonAreaHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const input = parseOrThrow(updateCommonAreaSchema, request.body);
  const area = await commonAreasService.updateCommonArea(request.authUser!, id, input);
  return reply.send(area);
}
