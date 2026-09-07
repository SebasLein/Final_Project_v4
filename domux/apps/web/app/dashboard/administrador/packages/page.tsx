import { apiFetch } from '@/lib/api';
import { Card, Badge, EmptyState } from '@/components/dashboard-ui';

type Package = {
  id: string;
  recipient: string;
  status: 'PENDING' | 'DELIVERED';
  createdAt: string;
  deliveredAt: string | null;
  unit: { code: string };
};

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const query = status ? `?status=${status}` : '';
  const packages = await apiFetch<Package[]>(`/packages${query}`);

  const filters = [
    { label: 'Todos', value: '' },
    { label: 'Pendientes', value: 'PENDING' },
    { label: 'Entregados', value: 'DELIVERED' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Paquetes</h1>
        <p className="mt-1 text-sm text-slate-400">
          Historial completo. El registro y la entrega de paquetes se hacen desde la app móvil de portería.
        </p>
      </div>

      <div className="flex gap-2">
        {filters.map((f) => (
          <a
            key={f.value}
            href={f.value ? `?status=${f.value}` : '?'}
            className={`rounded-full px-3 py-1.5 text-xs transition ${
              (status ?? '') === f.value ? 'bg-white text-ink' : 'border border-white/10 text-slate-300 hover:bg-white/5'
            }`}
          >
            {f.label}
          </a>
        ))}
      </div>

      <Card title={`Resultados (${packages.length})`}>
        {packages.length === 0 ? (
          <EmptyState message="No hay paquetes que coincidan con el filtro." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-3">Destinatario</th>
                <th className="pb-3">Unidad</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td className="py-3">{pkg.recipient}</td>
                  <td className="py-3">{pkg.unit.code}</td>
                  <td className="py-3">
                    <Badge tone={pkg.status === 'DELIVERED' ? 'success' : 'warning'}>
                      {pkg.status === 'DELIVERED' ? 'Entregado' : 'Pendiente'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
