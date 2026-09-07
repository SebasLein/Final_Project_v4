import { prisma } from '../lib/prisma';
import { recordAudit } from '../lib/audit';
import { ConflictError } from '../lib/errors';
import { AuthUser } from '../types';
import { CreateUnitInput } from '../schemas/units.schema';

export async function listUnits(tenantId: string) {
  return prisma.unit.findMany({
    where: { tenantId },
    include: { residents: { select: { id: true, name: true, email: true, role: true, active: true } } },
    orderBy: { code: 'asc' }
  });
}

export async function createUnit(actor: AuthUser, input: CreateUnitInput) {
  const tenantId = actor.tenantId as string;
  const existing = await prisma.unit.findUnique({ where: { tenantId_code: { tenantId, code: input.code } } });
  if (existing) throw new ConflictError('Ya existe una unidad con ese código en esta propiedad');

  const unit = await prisma.unit.create({ data: { tenantId, code: input.code } });
  await recordAudit({ userId: actor.sub, tenantId, action: 'UNIT_CREATED', entity: 'UNIT', metadata: unit });
  return unit;
}
