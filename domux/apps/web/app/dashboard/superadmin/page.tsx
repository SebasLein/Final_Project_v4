import { apiFetch } from '@/lib/api';
import { StatCard, Card, EmptyState } from '@/components/dashboard-ui';

type GlobalSummary = { scope: 'global'; tenants: number; admins: number; totalUsers: number };
type Tenant = { id: string; name: string; slug: string; active: boolean; createdAt: string };

export default async function SuperadminDashboardPage() {
  const [summary, tenants] = await Promise.all([
    apiFetch<GlobalSummary>('/dashboard/summary'),
    apiFetch<Tenant[]>('/tenants')
  ]);

  const recentTenants = tenants.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard global</h1>
        <p className="mt-1 text-sm text-slate-400">Métricas reales de toda la plataforma DOMUX.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Propiedades registradas" value={summary.tenants} />
        <StatCard label="Administradores" value={summary.admins} />
        <StatCard label="Usuarios totales" value={summary.totalUsers} />
      </div>

      <Card title="Propiedades recientes">
        {recentTenants.length === 0 ? (
          <EmptyState message="Aún no hay propiedades registradas." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-3">Nombre</th>
                <th className="pb-3">Slug</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {recentTenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td className="py-3">{tenant.name}</td>
                  <td className="py-3 text-slate-400">{tenant.slug}</td>
                  <td className="py-3">{tenant.active ? 'Activa' : 'Inactiva'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
