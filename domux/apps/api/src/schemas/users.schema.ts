import { z } from "zod";

export const createAdminSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").trim(),
  email: z.string().email("Correo electrónico inválido").trim().toLowerCase(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  tenantId: z.string().min(1, "ID de propiedad requerido").trim(),
});

export const createTenantUserSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").trim(),
  email: z.string().email("Correo electrónico inválido").trim().toLowerCase(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  role: z.enum(["GATEKEEPER", "RESIDENT"]),
  unitId: z.string().min(1).trim().optional(),
});

export const updateUserActiveSchema = z.object({
  active: z.boolean(),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type CreateTenantUserInput = z.infer<typeof createTenantUserSchema>;
export type UpdateUserActiveInput = z.infer<typeof updateUserActiveSchema>;
