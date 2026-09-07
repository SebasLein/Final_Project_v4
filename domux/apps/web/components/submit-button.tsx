'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-ink transition disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel ?? 'Guardando…' : label}
    </button>
  );
}
