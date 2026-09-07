'use client';

import { useActionState } from 'react';
import { createTenantAction, ActionState } from '../actions';
import { Input, ErrorText } from '@/components/dashboard-ui';
import { SubmitButton } from '@/components/submit-button';

export function CreateTenantForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(createTenantAction, {});

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Input name="name" placeholder="Nombre de la propiedad" required />
      <Input name="slug" placeholder="slug-unico" pattern="[a-z0-9-]+" required />
      <SubmitButton label="Crear propiedad" />
      <div className="sm:col-span-3">
        <ErrorText message={state.error} />
      </div>
    </form>
  );
}
