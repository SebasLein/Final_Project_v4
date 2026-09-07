'use server';

import { redirect } from 'next/navigation';
import { apiLogin, ApiError } from '@/lib/api';
import { createSession } from '@/lib/session';

export type LoginState = { error?: string };

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Ingresa correo y contraseña.' };
  }

  let result;
  try {
    result = await apiLogin(email, password);
  } catch (err) {
    if (err instanceof ApiError) {
      return { error: err.status === 401 ? 'Correo o contraseña incorrectos.' : err.message };
    }
    return { error: 'No se pudo conectar con la API de DOMUX. Verifica que el backend esté corriendo.' };
  }

  const role = result.user.role;
  if (role !== 'SUPERADMIN' && role !== 'ADMIN') {
    return {
      error: 'Este panel web es solo para SUPERADMIN y ADMIN. Portería y residentes deben usar la app móvil de DOMUX.'
    };
  }

  await createSession({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: role as 'SUPERADMIN' | 'ADMIN',
      tenantId: result.user.tenantId
    }
  });

  redirect(role === 'SUPERADMIN' ? '/dashboard/superadmin' : '/dashboard/administrador');
}
