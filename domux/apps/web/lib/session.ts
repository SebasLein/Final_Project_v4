import { cookies } from 'next/headers';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: 'SUPERADMIN' | 'ADMIN' | 'GATEKEEPER' | 'RESIDENT';
  tenantId: string | null;
};

const ACCESS_COOKIE = 'domux_access';
const REFRESH_COOKIE = 'domux_refresh';
const USER_COOKIE = 'domux_user';

const COMMON_COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/'
};

export async function createSession(params: { accessToken: string; refreshToken: string; user: SessionUser }) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, params.accessToken, { ...COMMON_COOKIE_OPTS, maxAge: 60 * 15 });
  store.set(REFRESH_COOKIE, params.refreshToken, { ...COMMON_COOKIE_OPTS, maxAge: 60 * 60 * 24 * 7 });
  // Cookie NO httpOnly: solo lleva datos de UI (nombre/rol), nunca se usa para autorizar llamadas a la API.
  store.set(USER_COOKIE, JSON.stringify(params.user), {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
  store.delete(USER_COOKIE);
}

export async function getAccessToken() {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}
