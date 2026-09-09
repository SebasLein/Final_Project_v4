import { z } from "zod";

const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Formato de hora inválido (HH:mm)");

export const createCommonAreaSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .trim(),
    description: z.string().optional(),
    openTime: timeString,
    closeTime: timeString,
  })
  .refine((data) => data.openTime < data.closeTime, {
    message: "La hora de cierre debe ser posterior a la hora de apertura",
    path: ["closeTime"],
  });

export const updateCommonAreaSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .trim()
      .optional(),
    description: z.string().optional(),
    openTime: timeString.optional(),
    closeTime: timeString.optional(),
    active: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.openTime && data.closeTime) {
        return data.openTime < data.closeTime;
      }
      return true;
    },
    {
      message: "La hora de cierre debe ser posterior a la hora de apertura",
      path: ["closeTime"],
    },
  );

export type CreateCommonAreaInput = z.infer<typeof createCommonAreaSchema>;
export type UpdateCommonAreaInput = z.infer<typeof updateCommonAreaSchema>;
