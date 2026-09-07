import { getAccessToken } from './session';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * Llama al backend DOMUX adjuntando el access token de la sesión actual.
 * Se usa desde Server Components y Server Actions — nunca se expone el
 * token al navegador.
 */
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {})
    },
    cache: 'no-store'
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : undefined;

  if (!res.ok) {
    throw new ApiError(body?.message ?? 'Error al comunicarse con la API', res.status);
  }

  return body as T;
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    cache: 'no-store'
  });
  const body = await res.json();
  if (!res.ok) {
    throw new ApiError(body?.message ?? 'Credenciales inválidas', res.status);
  }
  return body as {
    accessToken: string;
    refreshToken: string;
    user: { id: string; name: string; email: string; role: string; tenantId: string | null };
  };
}
