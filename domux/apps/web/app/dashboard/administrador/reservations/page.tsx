import { apiFetch } from '@/lib/api';
import { Card, Badge, EmptyState } from '@/components/dashboard-ui';

type CommonArea = { id: string; name: string };
type Reservation = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'ACTIVE' | 'CANCELLED';
  commonArea: { name: string };
  resident: { name: string; unit: { code: string } | null };
};

export default async function ReservationsPage({
  searchParams
}: {
  searchParams: Promise<{ commonAreaId?: string; date?: string }>;
}) {
  const { commonAreaId, date } = await searchParams;
  const params = new URLSearchParams();
  if (commonAreaId) params.set('commonAreaId', commonAreaId);
  if (date) params.set('date', date);
  const query = params.toString() ? `?${params.toString()}` : '';

  const [reservations, areas] = await Promise.all([
    apiFetch<Reservation[]>(`/reservations${query}`),
    apiFetch<CommonArea[]>('/common-areas')
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Reservas</h1>
        <p className="mt-1 text-sm text-slate-400">
          Los residentes crean y cancelan sus reservas desde la app móvil. Aquí puedes consultarlas y filtrarlas.
        </p>
      </div>

      <form className="flex flex-wrap gap-3" method="get">
        <select
          name="commonAreaId"
          defaultValue={commonAreaId ?? ''}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
        >
          <option value="">Todas las zonas</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          defaultValue={date ?? ''}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
        />
        <button type="submit" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink">
          Filtrar
        </button>
      </form>

      <Card title={`Reservas (${reservations.length})`}>
        {reservations.length === 0 ? (
          <EmptyState message="No hay reservas que coincidan con el filtro." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-3">Zona</th>
                <th className="pb-3">Residente</th>
                <th className="pb-3">Fecha</th>
                <th className="pb-3">Horario</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td className="py-3">{r.commonArea.name}</td>
                  <td className="py-3">
                    {r.resident.name}
                    {r.resident.unit ? <span className="text-xs text-slate-500"> · {r.resident.unit.code}</span> : null}
                  </td>
                  <td className="py-3">{new Date(r.date).toLocaleDateString('es-CO')}</td>
                  <td className="py-3">
                    {r.startTime} – {r.endTime}
                  </td>
                  <td className="py-3">
                    <Badge tone={r.status === 'ACTIVE' ? 'success' : 'danger'}>
                      {r.status === 'ACTIVE' ? 'Activa' : 'Cancelada'}
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
