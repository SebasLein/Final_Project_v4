'use client';

import { useActionState } from 'react';
import { createNoticeAction, ActionState } from '../actions';
import { Input, ErrorText } from '@/components/dashboard-ui';
import { SubmitButton } from '@/components/submit-button';

export function CreateNoticeForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(createNoticeAction, {});

  return (
    <form action={formAction} className="space-y-3">
      <Input name="title" placeholder="Título del comunicado" required />
      <textarea
        name="body"
        placeholder="Contenido del comunicado"
        required
        rows={3}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-cyan/50"
      />
      <SubmitButton label="Publicar comunicado" />
      <ErrorText message={state.error} />
    </form>
  );
}
