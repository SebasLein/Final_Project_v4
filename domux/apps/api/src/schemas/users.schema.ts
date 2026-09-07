import { z } from 'zod';

// SUPERADMIN crea administradores y los asigna a una propiedad.
export const createAdminSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  tenantId: z.string().min(1)
});

// ADMIN crea residentes o porteros dentro de su propia propiedad.
export const createTenantUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['GATEKEEPER', 'RESIDENT']),
  unitId: z.string().min(1).optional()
});

export const updateUserActiveSchema = z.object({
  active: z.boolean()
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type CreateTenantUserInput = z.infer<typeof createTenantUserSchema>;
export type UpdateUserActiveInput = z.infer<typeof updateUserActiveSchema>;
