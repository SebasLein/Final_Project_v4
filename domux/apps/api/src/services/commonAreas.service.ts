import { prisma } from '../lib/prisma';
import { recordAudit } from '../lib/audit';
import { ConflictError, NotFoundError } from '../lib/errors';
import { AuthUser } from '../types';
import { CreateCommonAreaInput, UpdateCommonAreaInput } from '../schemas/commonAreas.schema';

export async function listCommonAreas(tenantId: string, onlyActive: boolean) {
  return prisma.commonArea.findMany({
    where: { tenantId, active: onlyActive ? true : undefined },
    orderBy: { name: 'asc' }
  });
}

export async function createCommonArea(actor: AuthUser, input: CreateCommonAreaInput) {
  const tenantId = actor.tenantId as string;
  const existing = await prisma.commonArea.findUnique({ where: { tenantId_name: { tenantId, name: input.name } } });
  if (existing) throw new ConflictError('Ya existe una zona común con ese nombre');

  const area = await prisma.commonArea.create({ data: { tenantId, ...input } });
  await recordAudit({ userId: actor.sub, tenantId, action: 'COMMON_AREA_CREATED', entity: 'COMMON_AREA', metadata: area });
  return area;
}

export async function updateCommonArea(actor: AuthUser, areaId: string, input: UpdateCommonAreaInput) {
  const tenantId = actor.tenantId as string;
  const area = await prisma.commonArea.findFirst({ where: { id: areaId, tenantId } });
  if (!area) throw new NotFoundError('Zona común no encontrada');

  const updated = await prisma.commonArea.update({ where: { id: areaId }, data: input });
  await recordAudit({
    userId: actor.sub,
    tenantId,
    action: 'COMMON_AREA_UPDATED',
    entity: 'COMMON_AREA',
    metadata: { areaId, ...input }
  });
  return updated;
}
