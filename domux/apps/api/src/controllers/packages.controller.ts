import { FastifyReply, FastifyRequest } from "fastify";
import { parseOrThrow } from "../lib/validate";
import {
  packageFiltersSchema,
  registerPackageSchema,
} from "../schemas/packages.schema";
import * as packagesService from "../services/packages.service";

export async function listPackagesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const filters = parseOrThrow(packageFiltersSchema, request.query);
  const packages = await packagesService.listPackages(
    request.authUser!,
    filters,
  );
  return reply.send(packages);
}

export async function registerPackageHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const input = parseOrThrow(registerPackageSchema, request.body);
  const pkg = await packagesService.registerPackage(request.authUser!, input);
  return reply.code(201).send(pkg);
}

export async function markDeliveredHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const pkg = await packagesService.markDelivered(request.authUser!, id);
  return reply.send(pkg);
}
