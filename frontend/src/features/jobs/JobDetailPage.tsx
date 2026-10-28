import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobs';
import { savedJobsApi } from '@/api/savedJobs';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { FullPageSpinner } from '@/components/Spinner';
import { useAuthStore } from '@/store/authStore';
import { ApplyPanel } from '@/features/applications/ApplyPanel';

const SaveJobButton = ({ jobId }: { jobId: string }) => {
  const queryClient = useQueryClient();
  const { data: savedJobs } = useQuery({ queryKey: ['saved-jobs'], queryFn: savedJobsApi.list });
  const isSaved = savedJobs?.some((s) => s.jobId === jobId) ?? false;

  const save = useMutation({
    mutationFn: () => savedJobsApi.save(jobId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-jobs'] }),
  });
  const unsave = useMutation({
    mutationFn: () => savedJobsApi.remove(jobId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-jobs'] }),
  });

  return (
    <Button
      variant="secondary"
      isLoading={save.isPending || unsave.isPending}
      onClick={() => (isSaved ? unsave.mutate() : save.mutate())}
    >
      {isSaved ? 'Unsave' : 'Save'}
    </Button>
  );
};

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const { data: job, isLoading } = useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) return <FullPageSpinner />;
  if (!job) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
            <p className="mt-1 text-slate-600">
              {job.company?.name} {job.location ? `· ${job.location}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="blue">{job.type.replace('_', ' ')}</Badge>
            {user?.role === 'JOB_SEEKER' && <SaveJobButton jobId={job.id} />}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
          {job.isRemote && <Badge tone="green">Remote</Badge>}
        </div>

        {(job.minSalary || job.maxSalary) && (
          <p className="mt-4 text-sm font-medium text-slate-700">
            {job.currency ?? ''} {job.minSalary ?? '—'} - {job.maxSalary ?? '—'}
          </p>
        )}

        <div className="mt-6 whitespace-pre-wrap text-sm text-slate-700">{job.description}</div>

        {job.requirements && (
          <>
            <h2 className="mt-6 font-semibold text-slate-900">Requirements</h2>
            <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{job.requirements}</div>
          </>
        )}
      </div>

      {(!user || user.role === 'JOB_SEEKER') && <ApplyPanel jobId={job.id} />}
    </div>
  );
};
