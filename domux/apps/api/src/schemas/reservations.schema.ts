import { z } from 'zod';

const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato de hora inválido (HH:mm)');

export const createReservationSchema = z
  .object({
    commonAreaId: z.string().min(1),
    date: z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Fecha inválida'),
    startTime: timeString,
    endTime: timeString
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'La hora de inicio debe ser anterior a la hora de fin',
    path: ['endTime']
  });

export const reservationFiltersSchema = z.object({
  commonAreaId: z.string().optional(),
  date: z.string().optional()
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type ReservationFilters = z.infer<typeof reservationFiltersSchema>;
