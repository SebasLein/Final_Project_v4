import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { ProblemsSection, SolutionSection, DashboardsSection, ModulesSection, SecuritySection } from '@/components/sections';
import { Footer } from '@/components/footer';

export default function Page() {
  return (
    <main>
      <Header />
      <Hero />
      <ProblemsSection />
      <SolutionSection />
      <ModulesSection />
      <DashboardsSection />
      <SecuritySection />
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="glass rounded-[2.25rem] p-8 text-center shadow-glow md:p-12">
            <p className="text-sm uppercase tracking-[0.22em] text-cyan">CTA final</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">Convierte la portería en un centro de control residencial inteligente.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">Explora la demo multirol y visualiza cómo DOMUX integra operación, seguridad, trazabilidad y experiencia premium en una sola plataforma.</p>
            <a href="/login" className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-ink">Ir al login demo</a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
