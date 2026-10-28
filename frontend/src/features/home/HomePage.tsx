import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobs';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { FullPageSpinner } from '@/components/Spinner';
import { clsx } from '@/utils/clsx';
import type { Job } from '@/types';

const tabs = [
  { key: 'ALL', label: 'All' },
  { key: 'FULL_TIME', label: 'Full time' },
  { key: 'INTERNSHIP', label: 'Internships' },
  { key: 'CONTRACT', label: 'Contract' },
  { key: 'REMOTE', label: 'Remote' },
] as const;

const card = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm';

const postedAgo = (iso: string) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return days <= 0 ? 'Today' : `${days}d ago`;
};

const SectionHeader = ({ title, to = '/jobs' }: { title: string; to?: string }) => (
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    <Link to={to} className="text-sm font-medium text-brand-600 hover:underline">
      View all
    </Link>
  </div>
);

const ProfileCard = () => {
  const user = useAuthStore((s) => s.user);
  const name = user?.email.split('@')[0] ?? 'Guest';

  return (
    <aside className={clsx(card, 'h-fit text-center lg:sticky lg:top-24')}>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-3xl font-bold uppercase text-brand-700 ring-4 ring-brand-100">
        {name.charAt(0)}
      </div>
      {user ? (
        <>
          <p className="mt-3 truncate text-base font-semibold text-slate-900">{name}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
          <Link to={user.role === 'RECRUITER' ? '/recruiter/jobs' : '/profile'}>
            <Button className="mt-4 rounded-full px-5">
              {user.role === 'RECRUITER' ? 'Go to dashboard' : 'Complete profile'}
            </Button>
          </Link>
          {user.role === 'JOB_SEEKER' && (
            <div className="mt-5 rounded-xl bg-brand-50 p-4 text-left">
              <p className="text-sm font-semibold text-slate-900">Quick links</p>
              <div className="mt-2 flex flex-col gap-2 text-sm">
                <Link to="/applications" className="text-brand-700 hover:underline">
                  My applications →
                </Link>
                <Link to="/saved-jobs" className="text-brand-700 hover:underline">
                  Saved jobs →
                </Link>
                <Link to="/job-alerts" className="text-brand-700 hover:underline">
                  Job alerts →
                </Link>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="mt-3 text-base font-semibold text-slate-900">Build your profile</p>
          <p className="mt-1 text-sm text-slate-500">Sign in to apply, save jobs and track applications.</p>
          <Link to="/register">
            <Button className="mt-4 w-full rounded-full">Sign up free</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" className="mt-2 w-full rounded-full">
              Log in
            </Button>
          </Link>
        </>
      )}
    </aside>
  );
};

const CompanyTile = ({ name, industry, jobs }: { name: string; industry?: string | null; jobs: number }) => (
  <div className="flex flex-col items-center rounded-2xl border border-slate-200 p-5 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-xl font-bold text-brand-700">
      {name.charAt(0)}
    </div>
    <p className="mt-3 line-clamp-2 min-h-[2.5rem] w-full text-sm font-semibold text-slate-900">{name}</p>
    <p className="mt-0.5 w-full truncate text-xs text-slate-500">{industry ?? 'Hiring now'}</p>
    <p className="mt-1 text-xs text-slate-600">
      {jobs} open {jobs === 1 ? 'job' : 'jobs'}
    </p>
    <Link
      to={`/jobs?q=${encodeURIComponent(name)}`}
      className="mt-3 text-sm font-medium text-brand-600 hover:underline"
    >
      View jobs
    </Link>
  </div>
);

const JobTile = ({ job }: { job: Job }) => (
  <Link
    to={`/jobs/${job.id}`}
    className="flex flex-col rounded-2xl border border-slate-200 p-4 transition hover:border-brand-300 hover:shadow-md"
  >
    <div className="flex items-start justify-between">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 font-bold text-brand-700">
        {job.company?.name?.charAt(0) ?? 'J'}
      </div>
      <span className="text-xs text-slate-400">{postedAgo(job.publishedAt ?? job.createdAt)}</span>
    </div>
    <h3 className="mt-3 line-clamp-2 min-h-[2.75rem] font-semibold leading-snug text-slate-900">{job.title}</h3>
    <p className="mt-0.5 line-clamp-1 text-sm text-slate-600">{job.company?.name}</p>
    <p className="mt-2 line-clamp-1 text-xs text-slate-500">{job.location ?? 'Location not specified'}</p>
    <div className="mt-3 flex flex-wrap gap-1.5">
      <Badge tone="blue">{job.type.replace('_', ' ')}</Badge>
      {job.isRemote && <Badge tone="green">Remote</Badge>}
    </div>
  </Link>
);

export const HomePage = () => {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<(typeof tabs)[number]['key']>('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', 'home'],
    queryFn: () => jobsApi.search({ page: 1, pageSize: 30 }),
  });

  const companies = useMemo(() => {
    const map = new Map<string, { name: string; industry?: string | null; jobs: number }>();
    data?.items.forEach((j) => {
      if (!j.company) return;
      const c = map.get(j.company.id) ?? { name: j.company.name, industry: j.company.industry, jobs: 0 };
      c.jobs += 1;
      map.set(j.company.id, c);
    });
    return [...map.values()];
  }, [data]);

  const visible = useMemo(() => {
    const items = data?.items ?? [];
    if (tab === 'ALL') return items;
    if (tab === 'REMOTE') return items.filter((j) => j.isRemote);
    return items.filter((j) => j.type === tab);
  }, [data, tab]);

  return (
    <>
      {!user && (
        <div className="bg-brand-800 text-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-4 py-3 text-center">
            <p className="text-sm font-medium sm:text-base">
              Create a profile once and get noticed by top companies
            </p>
            <Link
              to="/register"
              className="rounded-full border border-white/60 px-5 py-1.5 text-sm font-medium hover:bg-white/10"
            >
              Get started »
            </Link>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[260px_minmax(0,1fr)_280px]">
        <ProfileCard />

        <div className="flex min-w-0 flex-col gap-6">
          <section className={card}>
            <SectionHeader title="Explore jobs by top companies" />
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {isLoading && <FullPageSpinner />}
              {companies.map((c) => (
                <CompanyTile key={c.name} {...c} />
              ))}
            </div>
          </section>

          <section className={card}>
            <SectionHeader title="Recommended jobs for you" />
            <div className="no-scrollbar mt-4 flex gap-6 overflow-x-auto overflow-y-hidden border-b border-slate-200">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={clsx(
                    '-mb-px whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors',
                    tab === t.key
                      ? 'border-brand-600 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-800',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {isLoading && <FullPageSpinner />}
              {visible.map((job) => (
                <JobTile key={job.id} job={job} />
              ))}
            </div>
            {!isLoading && visible.length === 0 && (
              <p className="mt-5 text-sm text-slate-500">No openings in this category yet.</p>
            )}
          </section>
        </div>

        <aside className="flex h-fit flex-col gap-6 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-br from-brand-800 to-brand-500 px-5 py-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-100">Career guide</p>
              <p className="mt-2 text-xl font-bold leading-snug">How to land your first tech job</p>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-600">
                Build a strong profile, tailor your resume and apply early — recruiters respond to the first
                applicants.
              </p>
              <Link to="/jobs" className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline">
                Browse openings
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 p-6 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-100">Skill contest</p>
            <p className="mt-2 text-lg font-bold leading-snug">Take a quiz, earn a score, level up</p>
            <p className="mt-1 text-sm text-brand-100">React, JavaScript and SQL contests — beat your best score.</p>
            <Link to="/contests">
              <Button variant="secondary" className="mt-4 w-full rounded-full">
                Play now
              </Button>
            </Link>
          </div>
          <div className={card}>
            <p className="font-semibold text-slate-900">Hiring talent?</p>
            <p className="mt-1 text-sm text-slate-600">Post a job and reach thousands of candidates.</p>
            <Link to="/register">
              <Button variant="secondary" className="mt-3 w-full rounded-full">
                Post a job
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
};
