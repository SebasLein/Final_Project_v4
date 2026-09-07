import { apiFetch } from '@/lib/api';
import { Card, Badge, EmptyState } from '@/components/dashboard-ui';
import { CreateCommonAreaForm } from './create-area-form';
import { toggleCommonAreaAction } from '../actions';

type CommonArea = {
  id: string;
  name: string;
  description: string | null;
  openTime: string;
  closeTime: string;
  active: boolean;
};

export default async function CommonAreasPage() {
  const areas = await apiFetch<CommonArea[]>('/common-areas');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Zonas comunes</h1>
        <p className="mt-1 text-sm text-slate-400">Crea, edita y activa/desactiva las zonas reservables de tu propiedad.</p>
      </div>

      <Card title="Nueva zona común">
        <CreateCommonAreaForm />
      </Card>

      <Card title={`Zonas (${areas.length})`}>
        {areas.length === 0 ? (
          <EmptyState message="Aún no has creado zonas comunes." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-3">Nombre</th>
                <th className="pb-3">Horario</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {areas.map((area) => (
                <tr key={area.id}>
                  <td className="py-3">
                    {area.name}
                    {area.description ? <div className="text-xs text-slate-500">{area.description}</div> : null}
                  </td>
                  <td className="py-3">
                    {area.openTime} – {area.closeTime}
                  </td>
                  <td className="py-3">
                    <Badge tone={area.active ? 'success' : 'danger'}>{area.active ? 'Activa' : 'Inactiva'}</Badge>
                  </td>
                  <td className="py-3 text-right">
                    <form action={toggleCommonAreaAction.bind(null, area.id, !area.active)}>
                      <button
                        type="submit"
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:border-cyan/40 hover:bg-white/5"
                      >
                        {area.active ? 'Desactivar' : 'Activar'}
                      </button>
                    </form>
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
