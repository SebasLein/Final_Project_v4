import { z } from "zod";

export const createUnitSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "El código de unidad es requerido")
    .toUpperCase(),
});

export const updateUnitSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "El código de unidad es requerido")
    .toUpperCase()
    .optional(),
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;
