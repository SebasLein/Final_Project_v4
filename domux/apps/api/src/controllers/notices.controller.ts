import { FastifyReply, FastifyRequest } from "fastify";
import { parseOrThrow } from "../lib/validate";
import {
  createNoticeSchema,
  updateNoticeSchema,
} from "../schemas/notices.schema";
import * as noticesService from "../services/notices.service";

export async function listNoticesHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authUser = request.authUser!;
  const onlyActive = authUser.role !== "ADMIN";
  const notices = await noticesService.listNotices(
    authUser.tenantId as string,
    onlyActive,
  );
  return reply.send(notices);
}

export async function createNoticeHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const input = parseOrThrow(createNoticeSchema, request.body);
  const notice = await noticesService.createNotice(request.authUser!, input);
  return reply.code(201).send(notice);
}

export async function updateNoticeHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string };
  const input = parseOrThrow(updateNoticeSchema, request.body);
  const notice = await noticesService.updateNotice(
    request.authUser!,
    id,
    input,
  );
  return reply.send(notice);
}
