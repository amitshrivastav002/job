import { Link } from 'react-router-dom';
import { Badge } from '@/components/Badge';
import type { Job } from '@/types';

const formatSalary = (job: Job) => {
  if (!job.minSalary && !job.maxSalary) return null;
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
  const range = [job.minSalary, job.maxSalary].filter(Boolean).map((n) => fmt(n as number)).join(' – ');
  return `${job.currency ?? ''} ${range}`.trim();
};

const postedAgo = (iso: string) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'Posted today';
  if (days === 1) return 'Posted yesterday';
  return `Posted ${days} days ago`;
};

export const JobCard = ({ job }: { job: Job }) => {
  const salary = formatSalary(job);
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg font-bold text-brand-700">
        {job.company?.name?.charAt(0) ?? 'J'}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
          <div>
            <h2 className="text-base font-semibold leading-snug text-slate-900 group-hover:text-brand-700">
              {job.title}
            </h2>
            <p className="mt-0.5 text-sm text-slate-600">
              <span className="font-medium text-slate-700">{job.company?.name}</span>
              {job.location ? <span className="text-slate-400"> • </span> : null}
              {job.location}
            </p>
          </div>
          <Badge tone="blue">{job.type.replace('_', ' ')}</Badge>
        </div>

        {salary && <p className="mt-2 text-sm font-semibold text-slate-800">{salary}</p>}

        <div className="mt-2.5 flex flex-wrap gap-2">
          {job.skills.slice(0, 4).map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
          {job.isRemote && <Badge tone="green">Remote</Badge>}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{postedAgo(job.publishedAt ?? job.createdAt)}</span>
          <span className="font-medium text-brand-600 group-hover:underline">View & apply →</span>
        </div>
      </div>
    </Link>
  );
};
