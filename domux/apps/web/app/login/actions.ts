"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { apiLogin, ApiError } from "@/lib/api";
import { createSession } from "@/lib/session";

export type LoginState = { error?: string };

const loginInputSchema = z.object({
  email: z.string().trim().email("Correo electrónico inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const inputResult = loginInputSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!inputResult.success) {
    return {
      error: inputResult.error.issues.map((issue) => issue.message).join("; "),
    };
  }

  let result;
  try {
    result = await apiLogin(inputResult.data.email, inputResult.data.password);
  } catch (err) {
    if (err instanceof ApiError) {
      return {
        error:
          err.status === 401 ? "Correo o contraseña incorrectos." : err.message,
      };
    }
    return {
      error:
        "No se pudo conectar con la API de DOMUX. Verifica que el backend esté corriendo.",
    };
  }

  const role = result.user.role;
  if (role !== "SUPERADMIN" && role !== "ADMIN") {
    return {
      error:
        "Este panel web es solo para SUPERADMIN y ADMIN. Portería y residentes deben usar la app móvil de DOMUX.",
    };
  }

  await createSession({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: role as "SUPERADMIN" | "ADMIN",
      tenantId: result.user.tenantId,
    },
  });

  redirect(
    role === "SUPERADMIN"
      ? "/dashboard/superadmin"
      : "/dashboard/administrador",
  );
}
