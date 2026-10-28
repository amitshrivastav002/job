import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications';
import { useAuthStore } from '@/store/authStore';

export const NotificationBell = () => {
  const user = useAuthStore((s) => s.user);
  const isSeeker = user?.role === 'JOB_SEEKER';
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.list,
    refetchInterval: 60_000,
    enabled: isSeeker,
  });
  const unread = isSeeker ? (data?.filter((n) => !n.isRead).length ?? 0) : 0;

  return (
    <Link
      to={isSeeker ? '/notifications' : user ? '/' : '/login'}
      aria-label={unread ? `${unread} unread notifications` : 'Notifications'}
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path
          d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8ZM10.3 20a2 2 0 0 0 3.4 0"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {unread > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  );
};
