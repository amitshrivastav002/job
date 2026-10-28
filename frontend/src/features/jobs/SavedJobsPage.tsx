import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { savedJobsApi } from '@/api/savedJobs';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { FullPageSpinner } from '@/components/Spinner';

export const SavedJobsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['saved-jobs'], queryFn: savedJobsApi.list });

  const remove = useMutation({
    mutationFn: (jobId: string) => savedJobsApi.remove(jobId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-jobs'] }),
  });

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Saved Jobs</h1>
      <div className="mt-4 flex flex-col gap-3">
        {data?.length === 0 && <p className="text-sm text-slate-500">You haven't saved any jobs yet.</p>}
        {data?.map((saved) => (
          <div key={saved.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link to={`/jobs/${saved.job.id}`} className="font-semibold text-slate-900 hover:underline">
                  {saved.job.title}
                </Link>
                <p className="mt-0.5 text-sm text-slate-600">{saved.job.company?.name}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {saved.job.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
              <Button variant="ghost" onClick={() => remove.mutate(saved.job.id)}>
                Unsave
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
