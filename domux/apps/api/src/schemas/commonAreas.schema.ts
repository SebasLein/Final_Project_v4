import { z } from 'zod';

const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato de hora inválido (HH:mm)');

export const createCommonAreaSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  openTime: timeString,
  closeTime: timeString
});

export const updateCommonAreaSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  openTime: timeString.optional(),
  closeTime: timeString.optional(),
  active: z.boolean().optional()
});

export type CreateCommonAreaInput = z.infer<typeof createCommonAreaSchema>;
export type UpdateCommonAreaInput = z.infer<typeof updateCommonAreaSchema>;
