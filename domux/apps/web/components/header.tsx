import Link from 'next/link';
import { Container } from './ui';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-cyan to-violet font-black text-ink">D</div>
          <div>
            <div className="text-sm font-semibold tracking-[0.22em] text-slate-300">DOMUX</div>
            <div className="text-xs text-slate-500">Residential Security OS</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#modulos">Módulos</a>
          <a href="#beneficios">Beneficios</a>
          <a href="#dashboards">Dashboards</a>
          <a href="#seguridad">Seguridad</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-full border border-white/10 px-4 py-2 text-sm text-white transition hover:border-cyan/40 hover:bg-white/5">
            Ver demo
          </Link>
        </div>
      </Container>
    </header>
  );
}
