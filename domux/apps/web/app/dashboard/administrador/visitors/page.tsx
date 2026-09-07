import { apiFetch } from '@/lib/api';
import { Card, Badge, EmptyState } from '@/components/dashboard-ui';

type Visitor = {
  id: string;
  fullName: string;
  documentId: string;
  type: string;
  status: 'AUTHORIZED' | 'CANCELLED' | 'ENTERED' | 'EXITED';
  createdAt: string;
  entryAt: string | null;
  exitAt: string | null;
  unit: { code: string };
  authorizedBy: { name: string };
};

const STATUS_TONE: Record<Visitor['status'], 'default' | 'success' | 'warning' | 'danger'> = {
  AUTHORIZED: 'warning',
  ENTERED: 'success',
  EXITED: 'default',
  CANCELLED: 'danger'
};

const STATUS_LABEL: Record<Visitor['status'], string> = {
  AUTHORIZED: 'Autorizado',
  ENTERED: 'Ingresó',
  EXITED: 'Salió',
  CANCELLED: 'Cancelado'
};

export default async function VisitorsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const query = status ? `?status=${status}` : '';
  const visitors = await apiFetch<Visitor[]>(`/visitors${query}`);

  const filters = [
    { label: 'Todos', value: '' },
    { label: 'Autorizados', value: 'AUTHORIZED' },
    { label: 'Ingresaron', value: 'ENTERED' },
    { label: 'Salieron', value: 'EXITED' },
    { label: 'Cancelados', value: 'CANCELLED' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Visitantes</h1>
        <p className="mt-1 text-sm text-slate-400">
          Historial completo de tu propiedad. El registro de entradas/salidas se hace desde la app móvil de portería.
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

      <Card title={`Resultados (${visitors.length})`}>
        {visitors.length === 0 ? (
          <EmptyState message="No hay visitantes que coincidan con el filtro." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-3">Visitante</th>
                <th className="pb-3">Unidad</th>
                <th className="pb-3">Tipo</th>
                <th className="pb-3">Autorizado por</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {visitors.map((visitor) => (
                <tr key={visitor.id}>
                  <td className="py-3">
                    {visitor.fullName}
                    <div className="text-xs text-slate-500">{visitor.documentId}</div>
                  </td>
                  <td className="py-3">{visitor.unit.code}</td>
                  <td className="py-3">{visitor.type}</td>
                  <td className="py-3">{visitor.authorizedBy?.name ?? '—'}</td>
                  <td className="py-3">
                    <Badge tone={STATUS_TONE[visitor.status]}>{STATUS_LABEL[visitor.status]}</Badge>
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
