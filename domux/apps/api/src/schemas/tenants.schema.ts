import { z } from 'zod';

export const createTenantSchema = z.object({
  name: z.string().min(3),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'El slug solo admite minúsculas, números y guiones')
});

export const updateTenantSchema = z.object({
  name: z.string().min(3).optional(),
  active: z.boolean().optional()
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
