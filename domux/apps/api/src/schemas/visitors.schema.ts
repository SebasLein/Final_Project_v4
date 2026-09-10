import { z } from "zod";

const visitorType = z.enum(["VISITOR", "DELIVERY", "TECHNICIAN"]);

export const authorizeVisitorSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "El nombre completo debe tener al menos 3 caracteres"),
  documentId: z
    .string()
    .trim()
    .min(5, "El documento debe tener al menos 5 caracteres"),
  type: visitorType,
});

export const registerVisitorManuallySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "El nombre completo debe tener al menos 3 caracteres"),
  documentId: z
    .string()
    .trim()
    .min(5, "El documento debe tener al menos 5 caracteres"),
  type: visitorType,
  unitCode: z
    .string()
    .trim()
    .min(1, "El código de unidad es requerido")
    .toUpperCase(),
});

export const visitorFiltersSchema = z.object({
  status: z.enum(["AUTHORIZED", "CANCELLED", "ENTERED", "EXITED"]).optional(),
  unitCode: z.string().trim().min(1).toUpperCase().optional(),
});

export type AuthorizeVisitorInput = z.infer<typeof authorizeVisitorSchema>;
export type RegisterVisitorManuallyInput = z.infer<
  typeof registerVisitorManuallySchema
>;
export type VisitorFilters = z.infer<typeof visitorFiltersSchema>;
