import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobs';
import { Badge } from '@/components/Badge';
import { FullPageSpinner } from '@/components/Spinner';

export const RecommendedJobsPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['jobs', 'recommended'], queryFn: jobsApi.recommended });

  if (isLoading) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Recommended For You</h1>
      <div className="mt-4 flex flex-col gap-3">
        {data?.length === 0 && (
          <p className="text-sm text-slate-500">
            Add skills to your profile to get personalized recommendations.
          </p>
        )}
        {data?.map((job) => (
          <div key={job.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link to={`/jobs/${job.id}`} className="font-semibold text-slate-900 hover:underline">
                  {job.title}
                </Link>
                <p className="mt-0.5 text-sm text-slate-600">{job.company?.name}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
              <Badge tone="blue">{job.matchCount} skill match{job.matchCount === 1 ? '' : 'es'}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
