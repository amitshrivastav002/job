import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { companiesApi } from '@/api/companies';
import { profilesApi } from '@/api/profiles';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { FullPageSpinner } from '@/components/Spinner';

interface CompanyForm {
  name: string;
  description: string;
  website: string;
  logoUrl: string;
}

export const CompanyProfilePage = () => {
  const queryClient = useQueryClient();
  const { data: recruiterProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ['profile', 'recruiter'],
    queryFn: profilesApi.getRecruiterProfile,
  });
  const slug = recruiterProfile?.company?.slug;

  const { data: company, isLoading: loadingCompany } = useQuery({
    queryKey: ['companies', slug],
    queryFn: () => companiesApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const { register, handleSubmit, reset } = useForm<CompanyForm>({
    values: company
      ? {
          name: company.name,
          description: company.description ?? '',
          website: company.website ?? '',
          logoUrl: company.logoUrl ?? '',
        }
      : undefined,
  });

  const update = useMutation({
    mutationFn: (values: CompanyForm) => companiesApi.updateMine(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies', slug] });
      reset();
    },
  });

  if (loadingProfile || loadingCompany) return <FullPageSpinner />;

  if (!recruiterProfile?.company) {
    return <p className="text-sm text-slate-500">You are not associated with a company yet.</p>;
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-bold text-slate-900">Company Profile</h1>
      <form
        className="mt-4 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6"
        onSubmit={handleSubmit((v) => update.mutate(v))}
      >
        <Input label="Company name" {...register('name')} />
        <Input label="Website" placeholder="https://" {...register('website')} />
        <Input label="Logo URL" placeholder="https://" {...register('logoUrl')} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            rows={5}
            {...register('description')}
          />
        </div>
        <Button type="submit" isLoading={update.isPending} className="w-fit">
          Save changes
        </Button>
      </form>
    </div>
  );
};
