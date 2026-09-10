import { z } from "zod";

const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Formato de hora inválido (HH:mm)");

export const createReservationSchema = z
  .object({
    commonAreaId: z
      .string()
      .trim()
      .min(1, "El ID de la zona común es requerido"),
    date: z
      .string()
      .trim()
      .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida")
      .refine((v) => {
        const inputDate = new Date(v);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return inputDate >= today;
      }, "No se pueden realizar reservas para fechas pasadas"),
    startTime: timeString,
    endTime: timeString,
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "La hora de inicio debe ser anterior a la hora de fin",
    path: ["endTime"],
  });

export const reservationFiltersSchema = z.object({
  commonAreaId: z.string().trim().min(1).optional(),
  date: z
    .string()
    .trim()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida")
    .optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type ReservationFilters = z.infer<typeof reservationFiltersSchema>;
