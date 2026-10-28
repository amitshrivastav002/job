import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { Role } from '@/types';
import { Button } from '@/components/Button';

const navByRole: Record<Role, Array<{ to: string; label: string }>> = {
  JOB_SEEKER: [
    { to: '/jobs', label: 'Find Jobs' },
    { to: '/applications', label: 'My Applications' },
    { to: '/saved-jobs', label: 'Saved Jobs' },
    { to: '/recommended', label: 'Recommended' },
    { to: '/job-alerts', label: 'Job Alerts' },
    { to: '/profile', label: 'Profile' },
    { to: '/notifications', label: 'Notifications' },
  ],
  RECRUITER: [
    { to: '/recruiter/jobs', label: 'My Jobs' },
    { to: '/recruiter/jobs/new', label: 'Post a Job' },
    { to: '/recruiter/applicants', label: 'Applicants' },
    { to: '/recruiter/company', label: 'Company Profile' },
    { to: '/recruiter/analytics', label: 'Analytics' },
    { to: '/profile', label: 'Profile' },
    { to: '/notifications', label: 'Notifications' },
  ],
  ADMIN: [
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/jobs', label: 'Jobs' },
    { to: '/admin/companies', label: 'Companies' },
    { to: '/admin/analytics', label: 'Analytics' },
    { to: '/admin/settings', label: 'Settings' },
  ],
};

export const AppLayout = ({ allow }: { allow: Role[] }) => {
  const { user, clearSession } = useAuthStore();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/" replace />;

  const links = navByRole[user.role];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white px-4 py-6">
        <Link to="/" className="mb-8 block text-lg font-bold text-brand-700">
          JobPortal
        </Link>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-slate-200 pt-4">
          <p className="truncate px-3 text-xs text-slate-500">{user.email}</p>
          <Button
            variant="ghost"
            className="mt-1 w-full justify-start"
            onClick={() => {
              clearSession();
              navigate('/');
            }}
          >
            Log out
          </Button>
        </div>
      </aside>
      <main className="flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};
