import { apiFetch } from '@/lib/api';
import { Card, Badge, EmptyState } from '@/components/dashboard-ui';
import { CreateAdminForm } from './create-admin-form';
import { setUserActiveAction } from '../actions';

type Admin = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  tenant: { id: string; name: string } | null;
};
type Tenant = { id: string; name: string };

export default async function AdminsPage() {
  const [admins, tenants] = await Promise.all([
    apiFetch<Admin[]>('/admins'),
    apiFetch<Tenant[]>('/tenants')
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Administradores</h1>
        <p className="mt-1 text-sm text-slate-400">Crea administradores y asígnalos a una propiedad.</p>
      </div>

      <Card title="Nuevo administrador">
        <CreateAdminForm tenants={tenants} />
      </Card>

      <Card title={`Administradores (${admins.length})`}>
        {admins.length === 0 ? (
          <EmptyState message="Todavía no hay administradores registrados." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-3">Nombre</th>
                <th className="pb-3">Correo</th>
                <th className="pb-3">Propiedad</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="py-3">{admin.name}</td>
                  <td className="py-3 text-slate-400">{admin.email}</td>
                  <td className="py-3">{admin.tenant?.name ?? '—'}</td>
                  <td className="py-3">
                    <Badge tone={admin.active ? 'success' : 'danger'}>{admin.active ? 'Activo' : 'Inactivo'}</Badge>
                  </td>
                  <td className="py-3 text-right">
                    <form action={setUserActiveAction.bind(null, admin.id, !admin.active)}>
                      <button
                        type="submit"
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:border-cyan/40 hover:bg-white/5"
                      >
                        {admin.active ? 'Desactivar' : 'Activar'}
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
