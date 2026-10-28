import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { applicationsApi } from '@/api/applications';
import { Badge } from '@/components/Badge';
import { FullPageSpinner } from '@/components/Spinner';
import type { ApplicationStatus } from '@/types';

const statuses: ApplicationStatus[] = [
  'APPLIED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'OFFERED',
  'REJECTED',
  'WITHDRAWN',
];

const statusTone: Record<ApplicationStatus, 'slate' | 'green' | 'amber' | 'red' | 'blue'> = {
  APPLIED: 'slate',
  UNDER_REVIEW: 'blue',
  SHORTLISTED: 'amber',
  INTERVIEW: 'amber',
  OFFERED: 'green',
  REJECTED: 'red',
  WITHDRAWN: 'slate',
};

export const ApplicantsPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['applications', 'job', jobId],
    queryFn: () => applicationsApi.listForJob(jobId!),
    enabled: !!jobId,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) => applicationsApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications', 'job', jobId] }),
  });

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Applicants</h1>
      <div className="mt-4 flex flex-col gap-3">
        {data?.length === 0 && <p className="text-sm text-slate-500">No applicants yet.</p>}
        {data?.map((app) => (
          <div key={app.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">Applicant {app.jobSeekerProfileId.slice(0, 8)}</p>
                <p className="mt-0.5 text-xs text-slate-500">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
              </div>
              <Badge tone={statusTone[app.status]}>{app.status.replace('_', ' ')}</Badge>
            </div>
            {app.coverLetter && <p className="mt-2 text-sm text-slate-700">{app.coverLetter}</p>}
            <select
              className="mt-3 block rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
              value={app.status}
              disabled={updateStatus.isPending}
              onChange={(e) => updateStatus.mutate({ id: app.id, status: e.target.value as ApplicationStatus })}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};
