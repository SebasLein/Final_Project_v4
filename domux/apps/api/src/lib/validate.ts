import { ZodSchema } from 'zod';
import { AppError } from './errors';

export function parseOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new AppError(`Payload inválido: ${message}`, 400);
  }
  return result.data;
}
