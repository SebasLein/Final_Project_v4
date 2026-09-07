'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch, ApiError } from '@/lib/api';

export type ActionState = { error?: string; success?: boolean };

// --- Unidades ---
export async function createUnitAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const code = String(formData.get('code') ?? '').trim();
  try {
    await apiFetch('/units', { method: 'POST', body: JSON.stringify({ code }) });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : 'No se pudo crear la unidad.' };
  }
  revalidatePath('/dashboard/administrador/units');
  return { success: true };
}

// --- Usuarios (gatekeeper/resident) ---
export async function createTenantUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const role = String(formData.get('role') ?? '');
  const unitId = String(formData.get('unitId') ?? '') || undefined;

  try {
    await apiFetch('/users', { method: 'POST', body: JSON.stringify({ name, email, password, role, unitId }) });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : 'No se pudo crear el usuario.' };
  }
  revalidatePath('/dashboard/administrador/users');
  return { success: true };
}

// --- Zonas comunes ---
export async function createCommonAreaAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim() || undefined;
  const openTime = String(formData.get('openTime') ?? '');
  const closeTime = String(formData.get('closeTime') ?? '');

  try {
    await apiFetch('/common-areas', {
      method: 'POST',
      body: JSON.stringify({ name, description, openTime, closeTime })
    });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : 'No se pudo crear la zona común.' };
  }
  revalidatePath('/dashboard/administrador/common-areas');
  return { success: true };
}

export async function toggleCommonAreaAction(areaId: string, active: boolean) {
  await apiFetch(`/common-areas/${areaId}`, { method: 'PATCH', body: JSON.stringify({ active }) });
  revalidatePath('/dashboard/administrador/common-areas');
}

// --- Comunicados ---
export async function createNoticeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();

  try {
    await apiFetch('/notices', { method: 'POST', body: JSON.stringify({ title, body }) });
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : 'No se pudo crear el comunicado.' };
  }
  revalidatePath('/dashboard/administrador/notices');
  return { success: true };
}

export async function toggleNoticeAction(noticeId: string, active: boolean) {
  await apiFetch(`/notices/${noticeId}`, { method: 'PATCH', body: JSON.stringify({ active }) });
  revalidatePath('/dashboard/administrador/notices');
}
