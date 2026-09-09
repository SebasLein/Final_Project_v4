import { z } from "zod";

export const createUnitSchema = z.object({
  code: z
    .string()
    .min(1, "El código de unidad es requerido")
    .trim()
    .toUpperCase(),
});

export const updateUnitSchema = z.object({
  code: z
    .string()
    .min(1, "El código de unidad es requerido")
    .trim()
    .toUpperCase()
    .optional(),
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;
