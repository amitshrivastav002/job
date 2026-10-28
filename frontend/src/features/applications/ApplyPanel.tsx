import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { applicationsApi } from '@/api/applications';
import { resumesApi } from '@/api/resumes';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/Button';
import { getApiErrorMessage } from '@/lib/apiClient';

export const ApplyPanel = ({ jobId }: { jobId: string }) => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [resumeId, setResumeId] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState('');

  const { data: resumes } = useQuery({
    queryKey: ['resumes'],
    queryFn: resumesApi.list,
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: () => applicationsApi.apply({ jobId, resumeId: resumeId || undefined, coverLetter: coverLetter || undefined }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications', 'mine'] }),
  });

  if (!user) {
    return (
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-center">
        <Button onClick={() => navigate('/login', { state: { from: `/jobs/${jobId}` } })}>Apply</Button>
        <p className="mt-2 text-sm text-slate-600">Log in as a job seeker to apply.</p>
      </div>
    );
  }

  if (mutation.isSuccess) {
    return (
      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6 text-center text-sm text-green-800">
        Application submitted. Track its status from{' '}
        <button onClick={() => navigate('/applications')} className="font-medium underline">
          My Applications
        </button>
        .
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="font-semibold text-slate-900">Apply to this job</h2>

      {resumes && resumes.length > 0 && (
        <div className="mt-3">
          <label className="text-sm font-medium text-slate-700">Resume</label>
          <select
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
          >
            <option value="">Select a resume (optional)</option>
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.fileName} {r.isPrimary ? '(primary)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-3">
        <label className="text-sm font-medium text-slate-700">Cover letter (optional)</label>
        <textarea
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          rows={4}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />
      </div>

      {mutation.isError && <p className="mt-2 text-sm text-red-600">{getApiErrorMessage(mutation.error)}</p>}

      <Button className="mt-4" isLoading={mutation.isPending} onClick={() => mutation.mutate()}>
        Submit application
      </Button>
    </div>
  );
};
