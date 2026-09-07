import { NextRequest, NextResponse } from 'next/server';

function decodeRole(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const payloadSegment = token.split('.')[1];
    const json = Buffer.from(payloadSegment, 'base64').toString('utf-8');
    const payload = JSON.parse(json);
    return payload.role ?? null;
  } catch {
    return null;
  }
}

/**
 * Esta es una protección de RUTA (UX), no la autorización real: la seguridad
 * de verdad ocurre en el backend, que vuelve a validar la firma del JWT y el
 * rol en cada endpoint. Aquí solo evitamos que alguien sin sesión llegue
 * visualmente a una pantalla que de todos modos fallaría al pedir datos.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('domux_access')?.value;
  const role = decodeRole(token);

  if (pathname.startsWith('/dashboard')) {
    if (!role) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname.startsWith('/dashboard/superadmin') && role !== 'SUPERADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (pathname.startsWith('/dashboard/administrador') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
