import { CheckCircle2, CarFront, MessageSquareWarning, ShieldAlert, Package, LayoutDashboard, Building2, Users, Lock, Radar } from 'lucide-react';
import { Container, SectionTitle } from './ui';

const problems = [
  'Registros manuales sin contexto ni evidencia',
  'Poca trazabilidad sobre visitas, vehículos y paquetes',
  'Riesgos por permisos difusos y validaciones débiles',
  'Operación fragmentada entre portería, administración y residentes'
];

const benefits = [
  'Automatización operativa en accesos y entregas',
  'Trazabilidad completa con auditoría por evento',
  'Experiencia rápida y clara para portería, administración y residentes',
  'Arquitectura multi-tenant lista para crecer por conjuntos',
  'Seguridad base con JWT, RBAC, rate limit y defensas OWASP'
];

const modules = [
  { icon: ShieldAlert, title: 'Portería', description: 'Control de visitantes, salidas, evidencia y alertas rápidas.' },
  { icon: CarFront, title: 'Vehículos', description: 'Acceso vehicular, permanencia y parqueaderos de visitantes.' },
  { icon: Package, title: 'Paquetes', description: 'Registro, foto, cola de entrega y notificaciones.' },
  { icon: MessageSquareWarning, title: 'PQRS', description: 'Seguimiento transparente de incidencias y novedades.' },
  { icon: Building2, title: 'Administración', description: 'Comunicados, estados operativos, reportes y trazabilidad.' },
  { icon: Users, title: 'Residentes', description: 'Panel personal con accesos, paquetes y autoservicio.' },
  { icon: Lock, title: 'Seguridad', description: 'RBAC, logs, aislamiento por tenant y controles de acceso.' },
  { icon: LayoutDashboard, title: 'Dashboards', description: 'KPIs operativos y foco por rol.' }
];

const previews = [
  {
    title: 'Dashboard administrativo',
    stats: ['Ocupación 94%', 'PQRS abiertas 7', 'Comunicados activos 3']
  },
  {
    title: 'Panel de portería',
    stats: ['Visitantes hoy 128', 'Vehículos autorizados 76', 'Paquetes por entregar 19']
  },
  {
    title: 'Panel residente',
    stats: ['Paquetes pendientes 1', 'Visitas recientes 4', 'PQRS en curso 2']
  }
];

export function ProblemsSection() {
  return (
    <section className="py-24">
      <Container className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionTitle
          eyebrow="Problema"
          title="La operación residencial sigue atrapada en procesos manuales y poca visibilidad."
          description="Cuando visitantes, paquetes, accesos y novedades dependen de llamadas, planillas o grupos de mensajería, el riesgo operativo crece y la toma de decisiones se vuelve reactiva."
        />
        <div className="grid gap-4">
          {problems.map((item) => (
            <div key={item} className="glass rounded-3xl p-5 text-slate-200 shadow-glow">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-rose-500/10 p-2 text-rose-300">
                  <Radar className="h-4 w-4" />
                </div>
                <p className="leading-7">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function SolutionSection() {
  return (
    <section id="beneficios" className="py-24">
      <Container className="space-y-12">
        <SectionTitle
          eyebrow="Solución DOMUX"
          title="Una capa operacional inteligente que conecta seguridad, administración y residentes."
          description="DOMUX transforma la portería y la administración en un sistema trazable, con paneles diferenciados, permisos robustos e información clara por tenant y por rol."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {benefits.map((item) => (
            <div key={item} className="glass rounded-3xl p-5 shadow-glow">
              <CheckCircle2 className="mb-4 h-6 w-6 text-emerald" />
              <p className="text-sm leading-7 text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ModulesSection() {
  return (
    <section id="modulos" className="py-24">
      <Container className="space-y-12">
        <SectionTitle
          eyebrow="Módulos"
          title="Un núcleo modular para toda la cadena operativa del conjunto residencial."
          description="Cada módulo nace con criterios de seguridad, trazabilidad y separación de responsabilidades para facilitar crecimiento, mantenimiento y experiencia de uso."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => (
            <div key={module.title} className="glass rounded-[2rem] p-6 shadow-glow transition hover:-translate-y-1">
              <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-cyan/20 to-violet/20 p-3 text-cyan">
                <module.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">{module.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-350 text-slate-300">{module.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function DashboardsSection() {
  return (
    <section id="dashboards" className="py-24">
      <Container className="space-y-12">
        <SectionTitle
          eyebrow="Dashboards demo"
          title="Interfaz inspirada en SaaS enterprise: limpia, rápida y orientada a decisiones."
          description="Los previews muestran cómo DOMUX diferencia la operación por rol para reducir fricción y acelerar tareas críticas en el día a día."
        />
        <div className="grid gap-6 xl:grid-cols-3">
          {previews.map((item, index) => (
            <div key={item.title} className="glass rounded-[2rem] p-5 shadow-glow">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <div className="mt-1 text-sm text-slate-400">Preview {index + 1}</div>
                </div>
                <div className="rounded-full bg-white/5 px-3 py-1 text-xs text-cyan">Live demo</div>
              </div>
              <div className="rounded-[1.5rem] border border-white/5 bg-[#08111c] p-4">
                <div className="mb-4 grid grid-cols-3 gap-3">
                  {item.stats.map((stat) => (
                    <div key={stat} className="rounded-2xl bg-white/5 p-3 text-center text-xs text-slate-300">{stat}</div>
                  ))}
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((row) => (
                    <div key={row} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3">
                      <div>
                        <div className="text-sm font-medium text-white">Evento #{row}</div>
                        <div className="text-xs text-slate-400">Trazabilidad operativa en tiempo real</div>
                      </div>
                      <div className="rounded-full bg-emerald/10 px-3 py-1 text-xs text-emerald">Validado</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function SecuritySection() {
  return (
    <section id="seguridad" className="py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <SectionTitle
          eyebrow="Seguridad"
          title="Diseñado para operar con confianza desde el día uno."
          description="Aislamiento por tenant, JWT, refresh tokens, RBAC y auditoría forman una base sólida para evolucionar a una plataforma enterprise real."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {['Aislamiento multi-tenant', 'JWT + refresh tokens', 'RBAC por tipo de usuario', 'Rate limiting', 'Validación y sanitización', 'Logs y auditoría'].map((item) => (
            <div key={item} className="glass rounded-3xl p-5 shadow-glow text-slate-200">{item}</div>
          ))}
        </div>
      </Container>
    </section>
  );
}
