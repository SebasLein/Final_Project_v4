'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, CarFront, Package, Bell, Activity, Fingerprint } from 'lucide-react';
import { Container } from './ui';

const metrics = [
  { label: 'Eventos trazables', value: '100%' },
  { label: 'Tiempo de registro', value: '-68%' },
  { label: 'Visibilidad operativa', value: '24/7' }
];

export function Hero() {
  return (
    <section className="relative overflow-hidden section-grid">
      <Container className="grid gap-14 py-20 md:py-28 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div className="space-y-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-cyan">
            <Shield className="h-4 w-4" /> SaaS multi-tenant para operación residencial
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.7 }} className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl xl:text-7xl">
              Control residencial inteligente con una experiencia SaaS <span className="bg-gradient-to-r from-cyan via-white to-violet bg-clip-text text-transparent">premium</span>.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              DOMUX centraliza accesos peatonales y vehiculares, visitantes, paquetes, PQRS, comunicados y auditoría en tiempo real para administraciones modernas.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="flex flex-col gap-4 sm:flex-row">
            <Link href="/login" className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-ink shadow-glow transition hover:translate-y-[-1px]">
              Explorar demo interactiva
            </Link>
            <a href="#dashboards" className="rounded-full border border-white/10 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-cyan/40 hover:bg-white/5">
              Ver dashboards
            </a>
          </motion.div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            {metrics.map((item) => (
              <div key={item.label} className="glass rounded-3xl p-4 shadow-glow">
                <div className="text-2xl font-semibold text-white md:text-3xl">{item.value}</div>
                <div className="mt-2 text-sm text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.72 }} className="relative">
          <div className="absolute -inset-10 bg-gradient-to-r from-cyan/15 via-violet/10 to-emerald/15 blur-3xl" />
          <div className="glass relative rounded-[2rem] p-4 shadow-glow">
            <div className="rounded-[1.7rem] border border-white/5 bg-[#06111d] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">Centro de control</div>
                  <div className="text-xl font-semibold text-white">Altos de DOMUX</div>
                </div>
                <div className="rounded-full bg-emerald/15 px-3 py-1 text-xs font-medium text-emerald">Operación estable</div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[{icon: Fingerprint, title: 'Acceso peatonal', value: '128 ingresos hoy'}, {icon: CarFront, title: 'Acceso vehicular', value: '76 validaciones'}, {icon: Package, title: 'Paquetes', value: '19 pendientes'}, {icon: Bell, title: 'Comunicados', value: '3 publicaciones'}, {icon: Activity, title: 'Auditoría', value: '1,248 eventos'}, {icon: Shield, title: 'Seguridad', value: '0 incidentes críticos'}].map((card) => (
                  <div key={card.title} className="rounded-3xl border border-white/5 bg-white/5 p-4">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan/20 to-violet/20 text-cyan">
                      <card.icon className="h-5 w-5" />
                    </div>
                    <div className="text-sm text-slate-400">{card.title}</div>
                    <div className="mt-2 text-lg font-semibold text-white">{card.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
