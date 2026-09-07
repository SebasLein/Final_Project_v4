import { z } from 'zod';

export const createUnitSchema = z.object({
  code: z.string().min(1)
});

export type CreateUnitInput = z.infer<typeof createUnitSchema>;
