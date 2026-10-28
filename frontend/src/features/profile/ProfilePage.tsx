import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profilesApi } from '@/api/profiles';
import { resumesApi } from '@/api/resumes';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { Button } from '@/components/Button';
import { FullPageSpinner } from '@/components/Spinner';
import { Badge } from '@/components/Badge';
import { SectionEditor } from './SectionEditor';
import type {
  Achievement,
  Certification,
  Education,
  Experience,
  Language,
  Project,
} from '@/types';

const ProfileCompletionBar = ({ percentage }: { percentage: number }) => (
  <div>
    <div className="flex items-center justify-between text-xs text-slate-600">
      <span>Profile completion</span>
      <span className="font-medium">{percentage}%</span>
    </div>
    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full bg-brand-600" style={{ width: `${percentage}%` }} />
    </div>
  </div>
);

const JobSeekerFields = () => {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', 'job-seeker'],
    queryFn: profilesApi.getJobSeekerProfile,
  });
  const { data: resumes } = useQuery({ queryKey: ['resumes'], queryFn: resumesApi.list });

  const { register, handleSubmit, reset } = useForm({
    values: profile
      ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
          headline: profile.headline ?? '',
          location: profile.location ?? '',
          phone: profile.phone ?? '',
          skills: profile.skills.join(', '),
          summary: profile.summary ?? '',
          githubUrl: profile.githubUrl ?? '',
          linkedinUrl: profile.linkedinUrl ?? '',
          portfolioUrl: profile.portfolioUrl ?? '',
          preferredLocations: profile.preferredLocations.join(', '),
          workPreference: profile.workPreference ?? '',
          expectedSalary: profile.expectedSalary?.toString() ?? '',
          noticePeriod: profile.noticePeriod ?? '',
          employmentPreferences: profile.employmentPreferences.join(', '),
          isPublic: profile.isPublic,
          isVisibleToRecruiters: profile.isVisibleToRecruiters,
        }
      : undefined,
  });

  const update = useMutation({
    mutationFn: (values: Record<string, string | boolean>) =>
      profilesApi.updateJobSeekerProfile({
        firstName: values.firstName as string,
        lastName: values.lastName as string,
        headline: values.headline as string,
        location: values.location as string,
        phone: values.phone as string,
        summary: values.summary as string,
        githubUrl: (values.githubUrl as string) || undefined,
        linkedinUrl: (values.linkedinUrl as string) || undefined,
        portfolioUrl: (values.portfolioUrl as string) || undefined,
        noticePeriod: values.noticePeriod as string,
        workPreference: (values.workPreference as any) || null,
        expectedSalary: values.expectedSalary ? Number(values.expectedSalary) : null,
        skills: (values.skills as string).split(',').map((s) => s.trim()).filter(Boolean),
        preferredLocations: (values.preferredLocations as string)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        employmentPreferences: (values.employmentPreferences as string)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean) as any,
        isPublic: values.isPublic as boolean,
        isVisibleToRecruiters: values.isVisibleToRecruiters as boolean,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', 'job-seeker'] }),
  });

  const uploadPhoto = useMutation({
    mutationFn: profilesApi.uploadJobSeekerPhoto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', 'job-seeker'] }),
  });

  const upload = useMutation({
    mutationFn: resumesApi.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'job-seeker'] });
    },
  });

  const removeResume = useMutation({
    mutationFn: resumesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resumes'] }),
  });

  useEffect(() => {
    if (profile) reset();
  }, [profile, reset]);

  if (isLoading) return <FullPageSpinner />;
  if (!profile) return null;

  return (
    <>
      <ProfileCompletionBar percentage={profile.completionPercentage} />

      <div className="mt-6 flex items-center gap-4">
        {profile.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt="Profile"
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-slate-200" />
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadPhoto.mutate(file);
            e.target.value = '';
          }}
        />
        {uploadPhoto.isPending && <p className="text-xs text-slate-500">Uploading...</p>}
      </div>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit((v) => update.mutate(v as any))}
      >
        <div className="grid grid-cols-2 gap-4">
          <Input label="First name" {...register('firstName')} />
          <Input label="Last name" {...register('lastName')} />
        </div>
        <Input label="Headline" placeholder="Senior Frontend Engineer" {...register('headline')} />
        <Textarea label="About" rows={4} {...register('summary')} />
        <Input label="Skills (comma-separated)" {...register('skills')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Location" {...register('location')} />
          <Input label="Phone" {...register('phone')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Preferred locations (comma-separated)" {...register('preferredLocations')} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Work preference</label>
            <select
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500"
              {...register('workPreference')}
            >
              <option value="">Select...</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ON_SITE">On-site</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Expected salary" type="number" {...register('expectedSalary')} />
          <Input label="Notice period" placeholder="30 days" {...register('noticePeriod')} />
        </div>
        <Input
          label="Employment preferences (comma-separated: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE)"
          {...register('employmentPreferences')}
        />

        <div className="grid grid-cols-3 gap-4">
          <Input label="GitHub" {...register('githubUrl')} />
          <Input label="LinkedIn" {...register('linkedinUrl')} />
          <Input label="Portfolio" {...register('portfolioUrl')} />
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" {...register('isPublic')} />
            Public profile
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" {...register('isVisibleToRecruiters')} />
            Visible to recruiters in search
          </label>
        </div>

        <Button type="submit" isLoading={update.isPending} className="w-fit">
          Save profile
        </Button>
      </form>

      <SectionEditor<Experience>
        section="experiences"
        title="Experience"
        fields={[
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'company', label: 'Company', type: 'text' },
          { name: 'location', label: 'Location', type: 'text' },
          { name: 'startDate', label: 'Start date', type: 'date' },
          { name: 'endDate', label: 'End date', type: 'date' },
          { name: 'isCurrent', label: 'I currently work here', type: 'checkbox' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ]}
        renderSummary={(item) => ({
          primary: `${item.title} · ${item.company}`,
          secondary: item.location ?? undefined,
        })}
      />

      <SectionEditor<Education>
        section="educations"
        title="Education"
        fields={[
          { name: 'institution', label: 'Institution', type: 'text' },
          { name: 'degree', label: 'Degree', type: 'text' },
          { name: 'fieldOfStudy', label: 'Field of study', type: 'text' },
          { name: 'startDate', label: 'Start date', type: 'date' },
          { name: 'endDate', label: 'End date', type: 'date' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ]}
        renderSummary={(item) => ({
          primary: `${item.degree} · ${item.institution}`,
          secondary: item.fieldOfStudy ?? undefined,
        })}
      />

      <SectionEditor<Project>
        section="projects"
        title="Projects"
        fields={[
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'url', label: 'URL', type: 'text' },
          { name: 'techStack', label: 'Tech stack (comma-separated)', type: 'tags' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ]}
        renderSummary={(item) => ({
          primary: item.title,
          secondary: item.techStack.join(', '),
        })}
      />

      <SectionEditor<Certification>
        section="certifications"
        title="Certifications"
        fields={[
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'issuer', label: 'Issuer', type: 'text' },
          { name: 'issueDate', label: 'Issue date', type: 'date' },
          { name: 'expiryDate', label: 'Expiry date', type: 'date' },
          { name: 'credentialUrl', label: 'Credential URL', type: 'text' },
        ]}
        renderSummary={(item) => ({ primary: item.name, secondary: item.issuer ?? undefined })}
      />

      <SectionEditor<Achievement>
        section="achievements"
        title="Achievements"
        fields={[
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'date', label: 'Date', type: 'date' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ]}
        renderSummary={(item) => ({ primary: item.title, secondary: item.description ?? undefined })}
      />

      <SectionEditor<Language>
        section="languages"
        title="Languages"
        fields={[
          { name: 'name', label: 'Language', type: 'text' },
          {
            name: 'proficiency',
            label: 'Proficiency',
            type: 'select',
            options: ['BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE'],
          },
        ]}
        renderSummary={(item) => ({ primary: item.name, secondary: item.proficiency })}
      />

      <div className="mt-8 border-t border-slate-200 pt-6">
        <h2 className="font-semibold text-slate-900">Resumes</h2>
        <div className="mt-3 flex flex-col gap-2">
          {resumes?.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <span>
                {r.fileName} {r.isPrimary && <Badge tone="green">Primary</Badge>}
              </span>
              <Button variant="ghost" onClick={() => removeResume.mutate(r.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="mt-3 text-sm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload.mutate(file);
            e.target.value = '';
          }}
        />
        {upload.isPending && <p className="mt-1 text-xs text-slate-500">Uploading...</p>}
      </div>
    </>
  );
};

const RecruiterFields = () => {
  const { data: profile, isLoading } = useQuery({ queryKey: ['profile', 'recruiter'], queryFn: profilesApi.getRecruiterProfile });
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm({
    values: profile ? { fullName: profile.fullName, title: profile.title ?? '' } : undefined,
  });

  const update = useMutation({
    mutationFn: (values: { fullName: string; title: string }) => profilesApi.updateRecruiterProfile(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile', 'recruiter'] }),
  });

  if (isLoading) return <FullPageSpinner />;

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit((v) => update.mutate(v))}>
      <Input label="Full name" {...register('fullName')} />
      <Input label="Title" placeholder="Talent Acquisition Lead" {...register('title')} />
      {profile?.company && (
        <p className="text-sm text-slate-600">
          Company: <span className="font-medium">{profile.company.name}</span>
        </p>
      )}
      <Button type="submit" isLoading={update.isPending} className="w-fit">
        Save profile
      </Button>
    </form>
  );
};

export const ProfilePage = () => {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-bold text-slate-900">Profile</h1>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
        {user?.role === 'RECRUITER' ? <RecruiterFields /> : <JobSeekerFields />}
      </div>
    </div>
  );
};
