export function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}

export function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' }) {
  const tones: Record<string, string> = {
    default: 'bg-white/10 text-slate-200',
    success: 'bg-emerald/15 text-emerald',
    warning: 'bg-amber-500/15 text-amber-300',
    danger: 'bg-red-500/15 text-red-300'
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ message }: { message: string }) {
  return <p className="py-6 text-center text-sm text-slate-500">{message}</p>;
}

export function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">{message}</p>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan/50 ${props.className ?? ''}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan/50 ${props.className ?? ''}`}
    />
  );
}
