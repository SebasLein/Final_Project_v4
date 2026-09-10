import { z } from "zod";

export const createAdminSchema = z.object({
  name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().trim().email("Correo electrónico inválido").toLowerCase(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  tenantId: z.string().trim().min(1, "ID de propiedad requerido"),
});

export const createTenantUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().trim().email("Correo electrónico inválido").toLowerCase(),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    role: z.enum(["GATEKEEPER", "RESIDENT"]),
    unitId: z.string().trim().min(1).optional(),
  })
  .superRefine((input, context) => {
    if (input.role === "RESIDENT" && !input.unitId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["unitId"],
        message: "La unidad es obligatoria para los residentes",
      });
    }
  });

export const updateUserActiveSchema = z.object({
  active: z.boolean(),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type CreateTenantUserInput = z.infer<typeof createTenantUserSchema>;
export type UpdateUserActiveInput = z.infer<typeof updateUserActiveSchema>;
