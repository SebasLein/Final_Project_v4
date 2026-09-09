import { z } from "zod";

const visitorType = z.enum(["VISITOR", "DELIVERY", "TECHNICIAN"]);

export const authorizeVisitorSchema = z.object({
  fullName: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .trim(),
  documentId: z
    .string()
    .min(5, "El documento debe tener al menos 5 caracteres")
    .trim(),
  type: visitorType,
});

export const registerVisitorManuallySchema = z.object({
  fullName: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .trim(),
  documentId: z
    .string()
    .min(5, "El documento debe tener al menos 5 caracteres")
    .trim(),
  type: visitorType,
  unitCode: z
    .string()
    .min(1, "El código de unidad es requerido")
    .trim()
    .toUpperCase(),
});

export const visitorFiltersSchema = z.object({
  status: z.enum(["AUTHORIZED", "CANCELLED", "ENTERED", "EXITED"]).optional(),
  unitCode: z.string().trim().toUpperCase().optional(),
});

export type AuthorizeVisitorInput = z.infer<typeof authorizeVisitorSchema>;
export type RegisterVisitorManuallyInput = z.infer<
  typeof registerVisitorManuallySchema
>;
export type VisitorFilters = z.infer<typeof visitorFiltersSchema>;
