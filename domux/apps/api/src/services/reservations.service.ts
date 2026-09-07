import { prisma } from '../lib/prisma';
import { recordAudit } from '../lib/audit';
import { AppError, ConflictError, ForbiddenError, NotFoundError } from '../lib/errors';
import { AuthUser } from '../types';
import { CreateReservationInput, ReservationFilters } from '../schemas/reservations.schema';
import type { Reservation } from '@prisma/client';

function normalizeDate(dateStr: string) {
  const d = new Date(dateStr);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && bStart < aEnd;
}

export async function createReservation(actor: AuthUser, input: CreateReservationInput) {
  const tenantId = actor.tenantId as string;

  const area = await prisma.commonArea.findFirst({ where: { id: input.commonAreaId, tenantId } });
  if (!area) throw new NotFoundError('Zona común no encontrada');
  if (!area.active) throw new ConflictError('La zona común no está activa');

  if (input.startTime < area.openTime || input.endTime > area.closeTime) {
    throw new ConflictError(`La zona común solo está disponible entre ${area.openTime} y ${area.closeTime}`);
  }

  const date = normalizeDate(input.date);
  const sameDayReservations = await prisma.reservation.findMany({
    where: { commonAreaId: area.id, date, status: 'ACTIVE' }
  });

  const hasConflict = sameDayReservations.some((r: Reservation) => overlaps(input.startTime, input.endTime, r.startTime, r.endTime));
  if (hasConflict) {
    throw new ConflictError('El horario seleccionado se cruza con una reserva existente');
  }

  const reservation = await prisma.reservation.create({
    data: {
      tenantId,
      commonAreaId: area.id,
      residentId: actor.sub,
      date,
      startTime: input.startTime,
      endTime: input.endTime
    }
  });

  await recordAudit({
    userId: actor.sub,
    tenantId,
    action: 'RESERVATION_CREATED',
    entity: 'RESERVATION',
    metadata: { reservationId: reservation.id }
  });

  return reservation;
}

export async function cancelReservation(actor: AuthUser, reservationId: string) {
  const reservation = await prisma.reservation.findFirst({
    where: { id: reservationId, tenantId: actor.tenantId as string }
  });
  if (!reservation) throw new NotFoundError('Reserva no encontrada');
  if (reservation.residentId !== actor.sub) throw new ForbiddenError('Solo puedes cancelar tus propias reservas');
  if (reservation.status !== 'ACTIVE') throw new ConflictError('La reserva ya está cancelada');

  const updated = await prisma.reservation.update({ where: { id: reservationId }, data: { status: 'CANCELLED' } });
  await recordAudit({
    userId: actor.sub,
    tenantId: actor.tenantId,
    action: 'RESERVATION_CANCELLED',
    entity: 'RESERVATION',
    metadata: { reservationId }
  });
  return updated;
}

export async function listReservations(actor: AuthUser, filters: ReservationFilters) {
  const tenantId = actor.tenantId as string;
  const dateFilter = filters.date ? normalizeDate(filters.date) : undefined;

  if (actor.role === 'RESIDENT') {
    return prisma.reservation.findMany({
      where: { tenantId, residentId: actor.sub, commonAreaId: filters.commonAreaId, date: dateFilter },
      include: { commonArea: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
    });
  }

  if (!actor.tenantId) throw new AppError('Se requiere una propiedad para consultar reservas', 403);
  return prisma.reservation.findMany({
    where: { tenantId, commonAreaId: filters.commonAreaId, date: dateFilter },
    include: { commonArea: true, resident: { select: { name: true, unit: true } } },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
  });
}
