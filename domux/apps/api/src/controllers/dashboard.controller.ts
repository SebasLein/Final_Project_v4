import { FastifyReply, FastifyRequest } from "fastify";
import * as dashboardService from "../services/dashboard.service";

export async function dashboardSummaryHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const summary = await dashboardService.dashboardSummary(request.authUser!);
  return reply.send(summary);
}
