import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Badge } from '@/components/Badge';
import { FullPageSpinner } from '@/components/Spinner';
import type { Job, PaginatedResult } from '@/types';

const adminApi = {
  listJobs: () => apiClient.get<PaginatedResult<Job>>('/admin/jobs').then((r) => r.data),
};

export const AdminJobsPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'jobs'], queryFn: adminApi.listJobs });

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Jobs</h1>
      <div className="mt-4 flex flex-col gap-3">
        {data?.items.map((job) => (
          <div key={job.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">{job.title}</h2>
                <p className="mt-0.5 text-sm text-slate-600">{job.company?.name}</p>
              </div>
              <Badge tone={job.status === 'PUBLISHED' ? 'green' : job.status === 'CLOSED' ? 'amber' : 'slate'}>
                {job.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
