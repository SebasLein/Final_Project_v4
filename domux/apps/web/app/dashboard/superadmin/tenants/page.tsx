import { apiFetch } from '@/lib/api';
import { Card, Badge, EmptyState } from '@/components/dashboard-ui';
import { CreateTenantForm } from './create-tenant-form';
import { toggleTenantActiveAction } from '../actions';

type Tenant = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  _count: { users: number; units: number };
};

export default async function TenantsPage() {
  const tenants = await apiFetch<Tenant[]>('/tenants');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Propiedades</h1>
        <p className="mt-1 text-sm text-slate-400">Crea y administra las propiedades horizontales que usan DOMUX.</p>
      </div>

      <Card title="Nueva propiedad">
        <CreateTenantForm />
      </Card>

      <Card title={`Propiedades (${tenants.length})`}>
        {tenants.length === 0 ? (
          <EmptyState message="Todavía no hay propiedades registradas." />
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="pb-3">Nombre</th>
                <th className="pb-3">Slug</th>
                <th className="pb-3">Usuarios</th>
                <th className="pb-3">Unidades</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {tenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td className="py-3">{tenant.name}</td>
                  <td className="py-3 text-slate-400">{tenant.slug}</td>
                  <td className="py-3">{tenant._count.users}</td>
                  <td className="py-3">{tenant._count.units}</td>
                  <td className="py-3">
                    <Badge tone={tenant.active ? 'success' : 'danger'}>{tenant.active ? 'Activa' : 'Inactiva'}</Badge>
                  </td>
                  <td className="py-3 text-right">
                    <form action={toggleTenantActiveAction.bind(null, tenant.id, !tenant.active)}>
                      <button
                        type="submit"
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:border-cyan/40 hover:bg-white/5"
                      >
                        {tenant.active ? 'Desactivar' : 'Activar'}
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
