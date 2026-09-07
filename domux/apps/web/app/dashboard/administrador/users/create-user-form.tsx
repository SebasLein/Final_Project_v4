'use client';

import { useActionState } from 'react';
import { createTenantUserAction, ActionState } from '../actions';
import { Input, Select, ErrorText } from '@/components/dashboard-ui';
import { SubmitButton } from '@/components/submit-button';

type Unit = { id: string; code: string };

export function CreateTenantUserForm({ units }: { units: Unit[] }) {
  const [state, formAction] = useActionState<ActionState, FormData>(createTenantUserAction, {});

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Input name="name" placeholder="Nombre completo" required />
      <Input name="email" type="email" placeholder="correo@ejemplo.com" required />
      <Input name="password" type="password" placeholder="Contraseña temporal" minLength={8} required />
      <Select name="role" required defaultValue="">
        <option value="" disabled>
          Rol
        </option>
        <option value="RESIDENT">Residente</option>
        <option value="GATEKEEPER">Portería</option>
      </Select>
      <Select name="unitId" defaultValue="">
        <option value="">Sin unidad (portería)</option>
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.code}
          </option>
        ))}
      </Select>
      <div className="lg:col-span-5">
        <SubmitButton label="Crear usuario" />
      </div>
      <div className="lg:col-span-5">
        <ErrorText message={state.error} />
      </div>
    </form>
  );
}
