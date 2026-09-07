import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { logoutAction } from './actions';

const ADMIN_NAV = [
  { href: '/dashboard/administrador', label: 'Dashboard' },
  { href: '/dashboard/administrador/units', label: 'Unidades' },
  { href: '/dashboard/administrador/users', label: 'Usuarios' },
  { href: '/dashboard/administrador/visitors', label: 'Visitantes' },
  { href: '/dashboard/administrador/packages', label: 'Paquetes' },
  { href: '/dashboard/administrador/common-areas', label: 'Zonas comunes' },
  { href: '/dashboard/administrador/reservations', label: 'Reservas' },
  { href: '/dashboard/administrador/notices', label: 'Comunicados' }
];

const SUPERADMIN_NAV = [
  { href: '/dashboard/superadmin', label: 'Dashboard' },
  { href: '/dashboard/superadmin/tenants', label: 'Propiedades' },
  { href: '/dashboard/superadmin/admins', label: 'Administradores' }
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const nav = user.role === 'SUPERADMIN' ? SUPERADMIN_NAV : ADMIN_NAV;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 text-white">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan to-violet text-sm font-black text-ink">
              D
            </div>
            <span className="text-sm font-semibold tracking-[0.2em] text-slate-300">DOMUX</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-white">{user.name}</div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{user.role}</div>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-300 transition hover:border-cyan/40 hover:bg-white/5"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6 pb-3 text-sm text-slate-300">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
