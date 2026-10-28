import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { jobsApi } from '@/api/jobs';
import { JobCard } from './JobCard';
import { FullPageSpinner } from '@/components/Spinner';
import { clsx } from '@/utils/clsx';
import type { JobType } from '@/types';

const jobTypes: { value: JobType; label: string }[] = [
  { value: 'FULL_TIME', label: 'Full time' },
  { value: 'PART_TIME', label: 'Part time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FREELANCE', label: 'Freelance' },
];

const quickFilters = ['React', 'Node.js', 'DevOps', 'Design', 'Data', 'Marketing'];

export const JobSearchPage = () => {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const setQ = (v: string) => setParams(v ? { q: v } : {});
  const [location, setLocation] = useState(params.get('location') ?? '');
  const [type, setType] = useState<JobType | ''>('');
  const [isRemote, setIsRemote] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', 'search', { q, location, type, isRemote, page }],
    queryFn: () =>
      jobsApi.search({
        q: q || undefined,
        location: location || undefined,
        type: type || undefined,
        isRemote: isRemote || undefined,
        page,
        pageSize: 10,
      }),
  });

  const update = <T,>(set: (v: T) => void) => (v: T) => {
    setPage(1);
    set(v);
  };
  const clearAll = () => {
    setQ('');
    setLocation('');
    setType('');
    setIsRemote(false);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="rounded-2xl bg-gradient-to-r from-brand-800 to-brand-600 px-6 py-6 text-white shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">Explore opportunities</h1>
        <p className="mt-1 text-sm text-brand-100">Browse roles from verified companies and apply in one click.</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-brand-100">Popular:</span>
          {quickFilters.map((tag) => (
            <button
              key={tag}
              onClick={() => update(setQ)(q === tag ? '' : tag)}
              className={clsx(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                q === tag ? 'border-white bg-white text-brand-700' : 'border-white/40 hover:bg-white/10',
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-20">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Filters</h2>
            <button onClick={clearAll} className="text-xs font-medium text-brand-600 hover:underline">
              Clear all
            </button>
          </div>

          <h3 className="mt-6 border-t border-slate-100 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">Location</h3>
          <input
            className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            placeholder="City or country"
            value={location}
            onChange={(e) => update(setLocation)(e.target.value)}
          />

          <h3 className="mt-6 border-t border-slate-100 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">Job type</h3>
          <div className="mt-3 flex flex-col gap-3">
            {jobTypes.map((t) => (
              <label key={t.value} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="type"
                  checked={type === t.value}
                  onChange={() => update(setType)(t.value)}
                  className="accent-brand-600"
                />
                {t.label}
              </label>
            ))}
          </div>

          <h3 className="mt-6 border-t border-slate-100 pt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">Work mode</h3>
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isRemote}
              onChange={(e) => update(setIsRemote)(e.target.checked)}
              className="accent-brand-600"
            />
            Remote only
          </label>
        </aside>

        <section>
          <p className="text-sm text-slate-600">
            {data ? (
              <>
                <span className="font-semibold text-slate-900">{data.total}</span> opportunities found
              </>
            ) : (
              'Searching…'
            )}
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {isLoading && <FullPageSpinner />}
            {!isLoading && data?.items.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                No jobs match your filters. Try clearing some of them.
              </div>
            )}
            {data?.items.map((job) => <JobCard key={job.id} job={job} />)}
          </div>

          {data && data.total > data.pageSize && (
            <div className="mt-6 flex items-center justify-center gap-3 text-sm">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-slate-600">Page {page}</span>
              <button
                disabled={page * data.pageSize >= data.total}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
