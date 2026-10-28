import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications';
import { Button } from '@/components/Button';
import { FullPageSpinner } from '@/components/Spinner';
import { clsx } from '@/utils/clsx';

export const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['notifications'], queryFn: notificationsApi.list });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['notifications'] });
  const markRead = useMutation({ mutationFn: notificationsApi.markRead, onSuccess: invalidate });
  const markAllRead = useMutation({ mutationFn: notificationsApi.markAllRead, onSuccess: invalidate });

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
        <Button variant="secondary" onClick={() => markAllRead.mutate()}>
          Mark all read
        </Button>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {data?.length === 0 && <p className="text-sm text-slate-500">You're all caught up.</p>}
        {data?.map((n) => (
          <button
            key={n.id}
            onClick={() => !n.isRead && markRead.mutate(n.id)}
            className={clsx(
              'rounded-lg border p-3 text-left text-sm',
              n.isRead ? 'border-slate-200 bg-white' : 'border-brand-200 bg-brand-50',
            )}
          >
            <p className="font-medium text-slate-900">{n.title}</p>
            <p className="mt-0.5 text-slate-600">{n.message}</p>
            <p className="mt-1 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
