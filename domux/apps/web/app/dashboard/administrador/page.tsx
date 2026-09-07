import { apiFetch } from '@/lib/api';
import { StatCard, Card, EmptyState } from '@/components/dashboard-ui';

type TenantSummary = {
  scope: 'tenant';
  units: number;
  residents: number;
  activeVisitors: number;
  pendingPackages: number;
  activeReservations: number;
};
type Notice = { id: string; title: string; publishedAt: string; active: boolean };

export default async function AdminDashboardPage() {
  const [summary, notices] = await Promise.all([
    apiFetch<TenantSummary>('/dashboard/summary'),
    apiFetch<Notice[]>('/notices')
  ]);

  const recentNotices = notices.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Métricas reales de tu propiedad.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Unidades" value={summary.units} />
        <StatCard label="Residentes" value={summary.residents} />
        <StatCard label="Visitantes activos" value={summary.activeVisitors} />
        <StatCard label="Paquetes pendientes" value={summary.pendingPackages} />
        <StatCard label="Reservas activas" value={summary.activeReservations} />
      </div>

      <Card title="Comunicados recientes">
        {recentNotices.length === 0 ? (
          <EmptyState message="Aún no has publicado comunicados." />
        ) : (
          <ul className="divide-y divide-white/5 text-sm text-slate-200">
            {recentNotices.map((notice) => (
              <li key={notice.id} className="flex items-center justify-between py-3">
                <span>{notice.title}</span>
                <span className="text-xs text-slate-500">{notice.active ? 'Publicado' : 'Inactivo'}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
