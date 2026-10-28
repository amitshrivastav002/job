import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '@/api/jobs';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { getApiErrorMessage } from '@/lib/apiClient';

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(20, 'Description should be at least 20 characters'),
  requirements: z.string().optional(),
  location: z.string().optional(),
  isRemote: z.boolean(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']),
  skills: z.string(),
  minSalary: z.coerce.number().optional(),
  maxSalary: z.coerce.number().optional(),
});
type FormValues = z.infer<typeof schema>;

export const NewJobPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { isRemote: false, type: 'FULL_TIME' } });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      jobsApi.create({
        ...values,
        skills: values.skills.split(',').map((s) => s.trim()).filter(Boolean),
      }),
    onSuccess: (job) => navigate(`/recruiter/jobs/${job.id}/applicants`),
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold text-slate-900">Post a new job</h1>
      <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
        <Input label="Job title" {...register('title')} error={errors.title?.message} />

        <div>
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            rows={5}
            {...register('description')}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Requirements (optional)</label>
          <textarea
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            rows={3}
            {...register('requirements')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Location" {...register('location')} />
          <div>
            <label className="text-sm font-medium text-slate-700">Job type</label>
            <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" {...register('type')}>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FREELANCE">Freelance</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Min salary" type="number" {...register('minSalary')} />
          <Input label="Max salary" type="number" {...register('maxSalary')} />
        </div>

        <Input label="Skills (comma-separated)" placeholder="React, TypeScript, Node.js" {...register('skills')} error={errors.skills?.message} />

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" {...register('isRemote')} />
          This is a remote position
        </label>

        {mutation.isError && <p className="text-sm text-red-600">{getApiErrorMessage(mutation.error)}</p>}

        <Button type="submit" isLoading={mutation.isPending}>
          Create job (draft)
        </Button>
      </form>
    </div>
  );
};
