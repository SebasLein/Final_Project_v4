'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api';

export type ActionState = { error?: string; success?: boolean };

export async function createTenantAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();

  try {
    await apiFetch('/tenants', { method: 'POST', body: JSON.stringify({ name, slug }) });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : 'No se pudo crear la propiedad.' };
  }

  revalidatePath('/dashboard/superadmin/tenants');
  return { success: true };
}

export async function toggleTenantActiveAction(tenantId: string, active: boolean) {
  await apiFetch(`/tenants/${tenantId}`, { method: 'PATCH', body: JSON.stringify({ active }) });
  revalidatePath('/dashboard/superadmin/tenants');
}

export async function createAdminAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const tenantId = String(formData.get('tenantId') ?? '');

  try {
    await apiFetch('/admins', { method: 'POST', body: JSON.stringify({ name, email, password, tenantId }) });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : 'No se pudo crear el administrador.' };
  }

  revalidatePath('/dashboard/superadmin/admins');
  return { success: true };
}

export async function setUserActiveAction(userId: string, active: boolean) {
  await apiFetch(`/users/${userId}/active`, { method: 'PATCH', body: JSON.stringify({ active }) });
  revalidatePath('/dashboard/superadmin/admins');
}
