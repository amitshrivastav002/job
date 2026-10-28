import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { applicationsApi } from '@/api/applications';
import { Badge } from '@/components/Badge';
import { FullPageSpinner } from '@/components/Spinner';
import type { ApplicationStatus } from '@/types';

const statusTone: Record<ApplicationStatus, 'slate' | 'green' | 'amber' | 'red' | 'blue'> = {
  APPLIED: 'slate',
  UNDER_REVIEW: 'blue',
  SHORTLISTED: 'amber',
  INTERVIEW: 'amber',
  OFFERED: 'green',
  REJECTED: 'red',
  WITHDRAWN: 'slate',
};

export const MyApplicationsPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['applications', 'mine'], queryFn: applicationsApi.listMine });

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">My Applications</h1>
      <div className="mt-4 flex flex-col gap-3">
        {data?.length === 0 && <p className="text-sm text-slate-500">You haven't applied to any jobs yet.</p>}
        {data?.map((app) => (
          <div key={app.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link to={`/jobs/${app.jobId}`} className="font-semibold text-slate-900 hover:underline">
                  {app.job?.title ?? 'Job'}
                </Link>
                <p className="mt-0.5 text-sm text-slate-600">{app.job?.company?.name}</p>
              </div>
              <Badge tone={statusTone[app.status]}>{app.status.replace('_', ' ')}</Badge>
            </div>
            <p className="mt-2 text-xs text-slate-500">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
            {app.recruiterNotes && <p className="mt-2 text-sm text-slate-700">Note: {app.recruiterNotes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
