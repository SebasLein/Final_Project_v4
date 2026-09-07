import { apiFetch } from '@/lib/api';
import { Card, Badge, EmptyState } from '@/components/dashboard-ui';
import { CreateTenantUserForm } from './create-user-form';

type Unit = { id: string; code: string };
type TenantUser = {
  id: string;
  name: string;
  email: string;
  role: 'GATEKEEPER' | 'RESIDENT';
  active: boolean;
  unit: Unit | null;
};

export default async function UsersPage() {
  const [users, units] = await Promise.all([
    apiFetch<TenantUser[]>('/users'),
    apiFetch<Unit[]>('/units')
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Usuarios</h1>
        <p className="mt-1 text-sm text-slate-400">Crea cuentas de portería y residentes para tu propiedad.</p>
      </div>

      <Card title="Nuevo usuario">
        <CreateTenantUserForm units={units} />
      </Card>

      <Card title={`Usuarios (${users.length})`}>
        {users.length === 0 ? (
          <EmptyState message="Aún no hay usuarios de portería o residentes registrados." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-3">Nombre</th>
                <th className="pb-3">Correo</th>
                <th className="pb-3">Rol</th>
                <th className="pb-3">Unidad</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-3">{user.name}</td>
                  <td className="py-3 text-slate-400">{user.email}</td>
                  <td className="py-3">{user.role === 'RESIDENT' ? 'Residente' : 'Portería'}</td>
                  <td className="py-3">{user.unit?.code ?? '—'}</td>
                  <td className="py-3">
                    <Badge tone={user.active ? 'success' : 'danger'}>{user.active ? 'Activo' : 'Inactivo'}</Badge>
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
