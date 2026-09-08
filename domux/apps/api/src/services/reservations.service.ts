import { prisma } from "../lib/prisma";
import { recordAudit } from "../lib/audit";
import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../lib/errors";
import { AuthUser } from "../types";
import {
  CreateReservationInput,
  ReservationFilters,
} from "../schemas/reservations.schema";
import type { Reservation } from "@prisma/client";

function normalizeDate(dateStr: string) {
  // Extrae YYYY-MM-DD directamente del string para evitar desfases por zona horaria
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function normalizeTimeFormat(timeStr: string) {
  // Asegura formato HH:MM (ej: "9:00" -> "09:00") para que la comparación de strings sea exacta
  const [hours, minutes] = timeStr.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return aStart < bEnd && bStart < aEnd;
}

export async function createReservation(
  actor: AuthUser,
  input: CreateReservationInput,
) {
  const tenantId = actor.tenantId as string;

  const area = await prisma.commonArea.findFirst({
    where: { id: input.commonAreaId, tenantId },
  });
  if (!area) throw new NotFoundError("Zona común no encontrada");
  if (!area.active) throw new ConflictError("La zona común no está activa");

  // Normalizar formatos de hora a HH:MM
  const startTime = normalizeTimeFormat(input.startTime);
  const endTime = normalizeTimeFormat(input.endTime);
  const openTime = normalizeTimeFormat(area.openTime);
  const closeTime = normalizeTimeFormat(area.closeTime);

  if (startTime >= endTime) {
    throw new ConflictError(
      "La hora de inicio debe ser menor a la hora de finalización",
    );
  }

  if (startTime < openTime || endTime > closeTime) {
    throw new ConflictError(
      `La zona común solo está disponible entre ${area.openTime} y ${area.closeTime}`,
    );
  }

  const date = normalizeDate(input.date);

  // Validar que la fecha no sea anterior al día de hoy
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (date < today) {
    throw new ConflictError("No se pueden crear reservas para fechas pasadas");
  }

  const sameDayReservations = await prisma.reservation.findMany({
    where: { commonAreaId: area.id, date, status: "ACTIVE" },
  });

  const hasConflict = sameDayReservations.some((r: Reservation) =>
    overlaps(
      startTime,
      endTime,
      normalizeTimeFormat(r.startTime),
      normalizeTimeFormat(r.endTime),
    ),
  );

  if (hasConflict) {
    throw new ConflictError(
      "El horario seleccionado se cruza con una reserva existente",
    );
  }

  const reservation = await prisma.reservation.create({
    data: {
      tenantId,
      commonAreaId: area.id,
      residentId: actor.sub,
      date,
      startTime,
      endTime,
    },
  });

  await recordAudit({
    userId: actor.sub,
    tenantId,
    action: "RESERVATION_CREATED",
    entity: "RESERVATION",
    metadata: { reservationId: reservation.id },
  });

  return reservation;
}

export async function cancelReservation(
  actor: AuthUser,
  reservationId: string,
) {
  const reservation = await prisma.reservation.findFirst({
    where: { id: reservationId, tenantId: actor.tenantId as string },
  });
  if (!reservation) throw new NotFoundError("Reserva no encontrada");
  if (reservation.residentId !== actor.sub)
    throw new ForbiddenError("Solo puedes cancelar tus propias reservas");
  if (reservation.status !== "ACTIVE")
    throw new ConflictError("La reserva ya está cancelada");

  const updated = await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: "CANCELLED" },
  });
  await recordAudit({
    userId: actor.sub,
    tenantId: actor.tenantId,
    action: "RESERVATION_CANCELLED",
    entity: "RESERVATION",
    metadata: { reservationId },
  });
  return updated;
}

export async function listReservations(
  actor: AuthUser,
  filters: ReservationFilters,
) {
  const tenantId = actor.tenantId as string;
  const dateFilter = filters.date ? normalizeDate(filters.date) : undefined;

  if (actor.role === "RESIDENT") {
    return prisma.reservation.findMany({
      where: {
        tenantId,
        residentId: actor.sub,
        commonAreaId: filters.commonAreaId,
        date: dateFilter,
      },
      include: { commonArea: true },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });
  }

  if (!actor.tenantId)
    throw new AppError(
      "Se requiere una propiedad para consultar reservas",
      403,
    );
  return prisma.reservation.findMany({
    where: { tenantId, commonAreaId: filters.commonAreaId, date: dateFilter },
    include: {
      commonArea: true,
      resident: { select: { name: true, unit: true } },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
}
