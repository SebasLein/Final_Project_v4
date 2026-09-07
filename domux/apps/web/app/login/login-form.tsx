'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, LoginState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Verificando…' : 'Ingresar'}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan/50"
          placeholder="admin@tupropiedad.com"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-xs uppercase tracking-[0.2em] text-slate-400">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan/50"
          placeholder="••••••••"
        />
      </div>
      {state.error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
