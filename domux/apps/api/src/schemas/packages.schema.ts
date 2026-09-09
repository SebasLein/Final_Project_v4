import { z } from "zod";

export const registerPackageSchema = z.object({
  unitCode: z
    .string()
    .min(1, "El código de unidad es requerido")
    .trim()
    .toUpperCase(),
  recipient: z
    .string()
    .min(3, "El destinatario debe tener al menos 3 caracteres")
    .trim(),
});

export const packageFiltersSchema = z.object({
  status: z.enum(["PENDING", "DELIVERED"]).optional(),
});

export type RegisterPackageInput = z.infer<typeof registerPackageSchema>;
export type PackageFilters = z.infer<typeof packageFiltersSchema>;
