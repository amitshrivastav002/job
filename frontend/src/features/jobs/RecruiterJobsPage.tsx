import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { jobsApi } from '@/api/jobs';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { FullPageSpinner } from '@/components/Spinner';
import type { JobStatus } from '@/types';

const statusTone: Record<JobStatus, 'slate' | 'green' | 'amber'> = {
  DRAFT: 'slate',
  PUBLISHED: 'green',
  CLOSED: 'amber',
};

export const RecruiterJobsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['jobs', 'mine'], queryFn: jobsApi.listMine });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['jobs', 'mine'] });
  const publish = useMutation({ mutationFn: jobsApi.publish, onSuccess: invalidate });
  const close = useMutation({ mutationFn: jobsApi.close, onSuccess: invalidate });

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">My Job Postings</h1>
        <Link to="/recruiter/jobs/new">
          <Button>Post a job</Button>
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {data?.length === 0 && <p className="text-sm text-slate-500">You haven't posted any jobs yet.</p>}
        {data?.map((job) => (
          <div key={job.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">{job.title}</h2>
                <p className="mt-0.5 text-sm text-slate-600">{job.location ?? 'Remote'}</p>
              </div>
              <Badge tone={statusTone[job.status]}>{job.status}</Badge>
            </div>
            <div className="mt-3 flex gap-2">
              <Link to={`/recruiter/jobs/${job.id}/applicants`}>
                <Button variant="secondary">View applicants</Button>
              </Link>
              {job.status === 'DRAFT' && (
                <Button isLoading={publish.isPending} onClick={() => publish.mutate(job.id)}>
                  Publish
                </Button>
              )}
              {job.status === 'PUBLISHED' && (
                <Button variant="danger" isLoading={close.isPending} onClick={() => close.mutate(job.id)}>
                  Close
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
