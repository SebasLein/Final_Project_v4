import { apiFetch } from '@/lib/api';
import { Card, Badge, EmptyState } from '@/components/dashboard-ui';
import { CreateNoticeForm } from './create-notice-form';
import { toggleNoticeAction } from '../actions';

type Notice = {
  id: string;
  title: string;
  body: string;
  active: boolean;
  publishedAt: string;
};

export default async function NoticesPage() {
  const notices = await apiFetch<Notice[]>('/notices');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Comunicados</h1>
        <p className="mt-1 text-sm text-slate-400">Publica y gestiona los comunicados de tu propiedad.</p>
      </div>

      <Card title="Nuevo comunicado">
        <CreateNoticeForm />
      </Card>

      <Card title={`Comunicados (${notices.length})`}>
        {notices.length === 0 ? (
          <EmptyState message="Aún no has publicado comunicados." />
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice.id} className="rounded-xl border border-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">{notice.title}</h3>
                    <p className="mt-1 text-sm text-slate-300">{notice.body}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Publicado el {new Date(notice.publishedAt).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge tone={notice.active ? 'success' : 'danger'}>{notice.active ? 'Activo' : 'Inactivo'}</Badge>
                    <form action={toggleNoticeAction.bind(null, notice.id, !notice.active)}>
                      <button
                        type="submit"
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:border-cyan/40 hover:bg-white/5"
                      >
                        {notice.active ? 'Desactivar' : 'Activar'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
