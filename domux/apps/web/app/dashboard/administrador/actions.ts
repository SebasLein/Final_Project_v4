"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { apiFetch, ApiError } from "@/lib/api";

export type ActionState = { error?: string; success?: boolean };

const createTenantUserInputSchema = z
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

const createUnitInputSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "El código de unidad es requerido")
    .toUpperCase(),
});

const createCommonAreaInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    description: z.string().trim().optional(),
    openTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Formato de hora inválido (HH:mm)"),
    closeTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Formato de hora inválido (HH:mm)"),
  })
  .refine((input) => input.openTime < input.closeTime, {
    path: ["closeTime"],
    message: "La hora de cierre debe ser posterior a la hora de apertura",
  });

// --- Unidades ---
export async function createUnitAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = createUnitInputSchema.safeParse({
    code: formData.get("code"),
  });

  if (!result.success) {
    return {
      error: result.error.issues.map((issue) => issue.message).join("; "),
    };
  }

  try {
    await apiFetch("/units", {
      method: "POST",
      body: JSON.stringify(result.data),
    });
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "No se pudo crear la unidad.",
    };
  }
  revalidatePath("/dashboard/administrador/units");
  return { success: true };
}

// --- Usuarios (gatekeeper/resident) ---
export async function createTenantUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = createTenantUserInputSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    unitId: String(formData.get("unitId") ?? "").trim() || undefined,
  });

  if (!result.success) {
    return {
      error: result.error.issues.map((issue) => issue.message).join("; "),
    };
  }

  try {
    await apiFetch("/users", {
      method: "POST",
      body: JSON.stringify(result.data),
    });
  } catch (err) {
    return {
      error:
        err instanceof ApiError ? err.message : "No se pudo crear el usuario.",
    };
  }
  revalidatePath("/dashboard/administrador/users");
  return { success: true };
}

// --- Zonas comunes ---
export async function createCommonAreaAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = createCommonAreaInputSchema.safeParse({
    name: formData.get("name"),
    description: String(formData.get("description") ?? "").trim() || undefined,
    openTime: formData.get("openTime"),
    closeTime: formData.get("closeTime"),
  });

  if (!result.success) {
    return {
      error: result.error.issues.map((issue) => issue.message).join("; "),
    };
  }

  try {
    await apiFetch("/common-areas", {
      method: "POST",
      body: JSON.stringify(result.data),
    });
  } catch (err) {
    return {
      error:
        err instanceof ApiError
          ? err.message
          : "No se pudo crear la zona común.",
    };
  }
  revalidatePath("/dashboard/administrador/common-areas");
  return { success: true };
}

export async function toggleCommonAreaAction(areaId: string, active: boolean) {
  await apiFetch(`/common-areas/${areaId}`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
  revalidatePath("/dashboard/administrador/common-areas");
}

// --- Comunicados ---
export async function createNoticeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  try {
    await apiFetch("/notices", {
      method: "POST",
      body: JSON.stringify({ title, body }),
    });
  } catch (err) {
    return {
      error:
        err instanceof ApiError
          ? err.message
          : "No se pudo crear el comunicado.",
    };
  }
  revalidatePath("/dashboard/administrador/notices");
  return { success: true };
}

export async function toggleNoticeAction(noticeId: string, active: boolean) {
  await apiFetch(`/notices/${noticeId}`, {
    method: "PATCH",
    body: JSON.stringify({ active }),
  });
  revalidatePath("/dashboard/administrador/notices");
}
