import { FastifyReply, FastifyRequest } from "fastify";
import { parseOrThrow } from "../lib/validate";
import { createUnitSchema } from "../schemas/units.schema";
import * as unitsService from "../services/units.service";

export async function listUnitsHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authUser = request.authUser!;
  const units = await unitsService.listUnits(authUser.tenantId as string);
  return reply.send(units);
}

export async function createUnitHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const input = parseOrThrow(createUnitSchema, request.body);
  const unit = await unitsService.createUnit(request.authUser!, input);
  return reply.code(201).send(unit);
}
