import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { jobAlertsApi } from '@/api/jobAlerts';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { FullPageSpinner } from '@/components/Spinner';
import type { JobType } from '@/types';

const jobTypes: JobType[] = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'];

interface AlertForm {
  keyword: string;
  location: string;
  jobType: JobType | '';
}

export const JobAlertsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['job-alerts'], queryFn: jobAlertsApi.list });
  const { register, handleSubmit, reset } = useForm<AlertForm>({
    defaultValues: { keyword: '', location: '', jobType: '' },
  });

  const create = useMutation({
    mutationFn: (values: AlertForm) =>
      jobAlertsApi.create({
        keyword: values.keyword || undefined,
        location: values.location || undefined,
        jobType: values.jobType || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-alerts'] });
      reset();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => jobAlertsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['job-alerts'] }),
  });

  if (isLoading) return <FullPageSpinner />;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Job Alerts</h1>

      <form
        className="mt-4 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6"
        onSubmit={handleSubmit((v) => create.mutate(v))}
      >
        <Input label="Keyword" placeholder="e.g. React" {...register('keyword')} />
        <Input label="Location" placeholder="e.g. Remote" {...register('location')} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Job type</label>
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" {...register('jobType')}>
            <option value="">Any</option>
            {jobTypes.map((t) => (
              <option key={t} value={t}>
                {t.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" isLoading={create.isPending} className="w-fit">
          Create alert
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-3">
        {data?.length === 0 && <p className="text-sm text-slate-500">No alerts yet.</p>}
        {data?.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <p className="text-sm text-slate-700">
              {[alert.keyword, alert.location, alert.jobType?.replace('_', ' ')].filter(Boolean).join(' · ') ||
                'Any job'}
            </p>
            <Button variant="ghost" onClick={() => remove.mutate(alert.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
