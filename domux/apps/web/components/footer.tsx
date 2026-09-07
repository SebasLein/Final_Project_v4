import Link from 'next/link';
import { Container } from './ui';

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <Container className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold tracking-[0.2em] text-white">DOMUX</div>
          <p className="mt-2 max-w-xl text-sm leading-7 text-slate-400">Demo institucional de una plataforma SaaS multi-tenant para seguridad y operación residencial.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink">Entrar a la demo</Link>
        </div>
      </Container>
    </footer>
  );
}
