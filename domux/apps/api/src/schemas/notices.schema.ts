import { z } from "zod";

export const createNoticeSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").trim(),
  body: z
    .string()
    .min(3, "El contenido debe tener al menos 3 caracteres")
    .trim(),
});

export const updateNoticeSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .trim()
    .optional(),
  body: z
    .string()
    .min(3, "El contenido debe tener al menos 3 caracteres")
    .trim()
    .optional(),
  active: z.boolean().optional(),
});

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;
