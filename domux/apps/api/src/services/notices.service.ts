import { prisma } from "../lib/prisma";
import { recordAudit } from "../lib/audit";
import { NotFoundError } from "../lib/errors";
import { AuthUser } from "../types";
import {
  CreateNoticeInput,
  UpdateNoticeInput,
} from "../schemas/notices.schema";

export async function listNotices(tenantId: string, onlyActive: boolean) {
  return prisma.notice.findMany({
    where: {
      tenantId,
      active: onlyActive ? true : undefined,
    },
    include: {
      createdBy: {
        select: { name: true, role: true },
      },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function createNotice(actor: AuthUser, input: CreateNoticeInput) {
  const tenantId = actor.tenantId as string;

  const notice = await prisma.notice.create({
    data: {
      tenantId,
      title: input.title,
      body: input.body,
      createdById: actor.sub,
      publishedAt: new Date(),
    },
  });

  await recordAudit({
    userId: actor.sub,
    tenantId,
    action: "NOTICE_CREATED",
    entity: "NOTICE",
    metadata: { noticeId: notice.id },
  });

  return notice;
}

export async function updateNotice(
  actor: AuthUser,
  noticeId: string,
  input: UpdateNoticeInput,
) {
  const tenantId = actor.tenantId as string;
  const notice = await prisma.notice.findFirst({
    where: { id: noticeId, tenantId },
  });
  if (!notice) throw new NotFoundError("Comunicado no encontrado");

  const updated = await prisma.notice.update({
    where: { id: noticeId },
    data: input,
  });

  await recordAudit({
    userId: actor.sub,
    tenantId,
    action: "NOTICE_UPDATED",
    entity: "NOTICE",
    metadata: { noticeId, ...input },
  });

  return updated;
}

export async function deleteNotice(actor: AuthUser, noticeId: string) {
  const tenantId = actor.tenantId as string;
  const notice = await prisma.notice.findFirst({
    where: { id: noticeId, tenantId },
  });
  if (!notice) throw new NotFoundError("Comunicado no encontrado");

  // En lugar de borrar físicamente, desactivamos (Soft Delete) para mantener auditoría
  const updated = await prisma.notice.update({
    where: { id: noticeId },
    data: { active: false },
  });

  await recordAudit({
    userId: actor.sub,
    tenantId,
    action: "NOTICE_DELETED",
    entity: "NOTICE",
    metadata: { noticeId },
  });

  return updated;
}
