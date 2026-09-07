'use client';

import { useActionState } from 'react';
import { createAdminAction, ActionState } from '../actions';
import { Input, Select, ErrorText } from '@/components/dashboard-ui';
import { SubmitButton } from '@/components/submit-button';

type Tenant = { id: string; name: string };

export function CreateAdminForm({ tenants }: { tenants: Tenant[] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(createAdminAction, {});

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Input name="name" placeholder="Nombre completo" required />
      <Input name="email" type="email" placeholder="correo@propiedad.com" required />
      <Input name="password" type="password" placeholder="Contraseña temporal" minLength={8} required />
      <Select name="tenantId" required defaultValue="">
        <option value="" disabled>
          Propiedad
        </option>
        {tenants.map((tenant) => (
          <option key={tenant.id} value={tenant.id}>
            {tenant.name}
          </option>
        ))}
      </Select>
      <div className="lg:col-span-4">
        <SubmitButton label="Crear administrador" />
      </div>
      <div className="lg:col-span-4">
        <ErrorText message={state.error} />
      </div>
    </form>
  );
}
