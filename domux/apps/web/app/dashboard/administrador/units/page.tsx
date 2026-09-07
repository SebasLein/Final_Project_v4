import { apiFetch } from '@/lib/api';
import { Card, EmptyState, Badge } from '@/components/dashboard-ui';
import { CreateUnitForm } from './create-unit-form';

type Resident = { id: string; name: string; email: string; role: string; active: boolean };
type Unit = { id: string; code: string; residents: Resident[] };

export default async function UnitsPage() {
  const units = await apiFetch<Unit[]>('/units');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Unidades y residentes</h1>
        <p className="mt-1 text-sm text-slate-400">Consulta las unidades de tu propiedad y quién vive en cada una.</p>
      </div>

      <Card title="Nueva unidad">
        <CreateUnitForm />
      </Card>

      <Card title={`Unidades (${units.length})`}>
        {units.length === 0 ? (
          <EmptyState message="Aún no hay unidades registradas." />
        ) : (
          <div className="space-y-4">
            {units.map((unit) => (
              <div key={unit.id} className="rounded-xl border border-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{unit.code}</span>
                  <span className="text-xs text-slate-500">{unit.residents.length} residente(s)</span>
                </div>
                {unit.residents.length > 0 ? (
                  <ul className="mt-3 space-y-1 text-sm text-slate-300">
                    {unit.residents
                      .filter((r) => r.role === 'RESIDENT')
                      .map((resident) => (
                        <li key={resident.id} className="flex items-center justify-between">
                          <span>
                            {resident.name} · {resident.email}
                          </span>
                          <Badge tone={resident.active ? 'success' : 'danger'}>
                            {resident.active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">Sin residentes asignados todavía.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
