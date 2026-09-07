import Link from 'next/link';
import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="glass w-full max-w-md rounded-[2rem] p-8 shadow-glow md:p-10">
        <Link href="/" className="mb-8 flex items-center gap-3 text-white">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan to-violet font-black text-ink">
            D
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.22em] text-slate-300">DOMUX</div>
            <div className="text-xs text-slate-500">Panel administrativo</div>
          </div>
        </Link>

        <h1 className="text-2xl font-semibold text-white">Inicia sesión</h1>
        <p className="mt-2 text-sm text-slate-400">
          Acceso para SUPERADMIN y ADMIN. Portería y residentes ingresan desde la app móvil de DOMUX.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
