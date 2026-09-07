'use client';

import { useActionState } from 'react';
import { createCommonAreaAction, ActionState } from '../actions';
import { Input, ErrorText } from '@/components/dashboard-ui';
import { SubmitButton } from '@/components/submit-button';

export function CreateCommonAreaForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(createCommonAreaAction, {});

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Input name="name" placeholder="Nombre (ej. Salón social)" required />
      <Input name="description" placeholder="Descripción (opcional)" />
      <Input name="openTime" type="time" required defaultValue="08:00" />
      <Input name="closeTime" type="time" required defaultValue="20:00" />
      <SubmitButton label="Crear zona" />
      <div className="lg:col-span-5">
        <ErrorText message={state.error} />
      </div>
    </form>
  );
}
