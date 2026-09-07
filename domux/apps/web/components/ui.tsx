import { clsx } from 'clsx';

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('mx-auto w-full max-w-7xl px-6 lg:px-8', className)} {...props} />;
}

export function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="inline-flex rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan">
        {eyebrow}
      </div>
      <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
      <p className="text-base leading-7 text-slate-300 md:text-lg">{description}</p>
    </div>
  );
}
