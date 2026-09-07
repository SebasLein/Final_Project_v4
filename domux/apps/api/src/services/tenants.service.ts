import { prisma } from '../lib/prisma';
import { recordAudit } from '../lib/audit';
import { ConflictError, NotFoundError } from '../lib/errors';
import { AuthUser } from '../types';
import { CreateTenantInput, UpdateTenantInput } from '../schemas/tenants.schema';

export async function listTenants() {
  return prisma.tenant.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { users: true, units: true } } }
  });
}

export async function createTenant(actor: AuthUser, input: CreateTenantInput) {
  const existing = await prisma.tenant.findUnique({ where: { slug: input.slug } });
  if (existing) throw new ConflictError('Ya existe una propiedad con ese slug');

  const tenant = await prisma.tenant.create({ data: { name: input.name, slug: input.slug } });
  await recordAudit({ userId: actor.sub, action: 'TENANT_CREATED', entity: 'TENANT', metadata: tenant });
  return tenant;
}

export async function updateTenant(actor: AuthUser, tenantId: string, input: UpdateTenantInput) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) throw new NotFoundError('Propiedad no encontrada');

  const updated = await prisma.tenant.update({ where: { id: tenantId }, data: input });
  await recordAudit({
    userId: actor.sub,
    tenantId,
    action: 'TENANT_UPDATED',
    entity: 'TENANT',
    metadata: input
  });
  return updated;
}
