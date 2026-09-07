import { prisma } from './prisma';

interface AuditParams {
  tenantId?: string | null;
  userId?: string | null;
  action: string;
  entity: string;
  metadata?: unknown;
}

export async function recordAudit({ tenantId, userId, action, entity, metadata }: AuditParams) {
  await prisma.auditLog.create({
    data: {
      tenantId: tenantId ?? undefined,
      userId: userId ?? undefined,
      action,
      entity,
      metadata: metadata as any
    }
  });
}
