"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { apiFetch, ApiError } from "@/lib/api";

export type ActionState = { error?: string; success?: boolean };

const createAdminInputSchema = z.object({
  name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().trim().email("Correo electrónico inválido").toLowerCase(),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  tenantId: z.string().trim().min(1, "La propiedad es obligatoria"),
});

export async function createTenantAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();

  try {
    await apiFetch("/tenants", {
      method: "POST",
      body: JSON.stringify({ name, slug }),
    });
  } catch (err) {
    return {
      error:
        err instanceof ApiError
          ? err.message
          : "No se pudo crear la propiedad.",
    };
  }

  revalidatePath("/dashboard/superadmin/tenants");
  return { success: true };
}

export async function toggleTenantActiveAction(
  tenantId: string,
  active: boolean,
) {
  await apiFetch(`/tenants/${tenantId}`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
  revalidatePath("/dashboard/superadmin/tenants");
}

export async function createAdminAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = createAdminInputSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    tenantId: formData.get("tenantId"),
  });

  if (!result.success) {
    return {
      error: result.error.issues.map((issue) => issue.message).join("; "),
    };
  }

  try {
    await apiFetch("/admins", {
      method: "POST",
      body: JSON.stringify(result.data),
    });
  } catch (err) {
    return {
      error:
        err instanceof ApiError
          ? err.message
          : "No se pudo crear el administrador.",
    };
  }

  revalidatePath("/dashboard/superadmin/admins");
  return { success: true };
}

export async function setUserActiveAction(userId: string, active: boolean) {
  await apiFetch(`/users/${userId}/active`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
  revalidatePath("/dashboard/superadmin/admins");
}
