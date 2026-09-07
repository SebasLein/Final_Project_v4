'use client';

import { useActionState } from 'react';
import { createUnitAction, ActionState } from '../actions';
import { Input, ErrorText } from '@/components/dashboard-ui';
import { SubmitButton } from '@/components/submit-button';

export function CreateUnitForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(createUnitAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
      <Input name="code" placeholder="Código de unidad (ej. T1-101)" required className="sm:max-w-xs" />
      <SubmitButton label="Crear unidad" />
      <ErrorText message={state.error} />
    </form>
  );
}
