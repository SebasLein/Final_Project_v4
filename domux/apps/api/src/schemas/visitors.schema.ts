import { z } from 'zod';

const visitorType = z.enum(['VISITOR', 'DELIVERY', 'TECHNICIAN']);

// Usado por RESIDENT para autorizar un visitante a su propia unidad.
export const authorizeVisitorSchema = z.object({
  fullName: z.string().min(3),
  documentId: z.string().min(5),
  type: visitorType
});

// Usado por GATEKEEPER para registrar manualmente un visitante no autorizado previamente.
export const registerVisitorManuallySchema = z.object({
  fullName: z.string().min(3),
  documentId: z.string().min(5),
  type: visitorType,
  unitCode: z.string().min(1)
});

export const visitorFiltersSchema = z.object({
  status: z.enum(['AUTHORIZED', 'CANCELLED', 'ENTERED', 'EXITED']).optional(),
  unitCode: z.string().optional()
});

export type AuthorizeVisitorInput = z.infer<typeof authorizeVisitorSchema>;
export type RegisterVisitorManuallyInput = z.infer<typeof registerVisitorManuallySchema>;
export type VisitorFilters = z.infer<typeof visitorFiltersSchema>;
