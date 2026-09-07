import { z } from 'zod';

export const createNoticeSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(3)
});

export const updateNoticeSchema = z.object({
  title: z.string().min(3).optional(),
  body: z.string().min(3).optional(),
  active: z.boolean().optional()
});

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;
