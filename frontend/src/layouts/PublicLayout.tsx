import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/Button';
import { NotificationBell } from '@/components/NotificationBell';
import { ProfileMenu } from '@/components/ProfileMenu';

export const PublicLayout = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-brand-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">J</span>
            JobPortal
          </Link>
          <form
            key={params.get('q') ?? ''}
            className="mx-6 hidden max-w-md flex-1 items-center rounded-full border border-slate-200 bg-white py-1 pl-4 pr-1 shadow-sm md:flex"
            onSubmit={(e) => {
              e.preventDefault();
              const q = String(new FormData(e.currentTarget).get('q') ?? '').trim();
              navigate(q ? `/jobs?q=${encodeURIComponent(q)}` : '/jobs');
            }}
          >
            <input
              name="q"
              defaultValue={params.get('q') ?? ''}
              placeholder="Search jobs here"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="9" r="5.5" />
                <path d="m13.5 13.5 4 4" strokeLinecap="round" />
              </svg>
            </button>
          </form>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <NotificationBell />
            <Link to="/jobs" className="text-slate-600 hover:text-slate-900">
              Find Jobs
            </Link>
            <Link to="/contests" className="text-slate-600 hover:text-slate-900">
              Contests
            </Link>
            {user ? (
              <ProfileMenu />
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900">
                  Log in
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <div className="mb-2 flex justify-center gap-6">
          <Link to="/jobs" className="hover:text-slate-900">
            Find Jobs
          </Link>
          <Link to="/register" className="hover:text-slate-900">
            For Employers
          </Link>
          <Link to="/login" className="hover:text-slate-900">
            Log in
          </Link>
        </div>
        © {new Date().getFullYear()} JobPortal
      </footer>
    </div>
  );
};
