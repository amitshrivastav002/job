import { apiClient } from '@/lib/apiClient';
import type { Application, ApplicationStatus } from '@/types';

export const applicationsApi = {
  apply: (payload: { jobId: string; resumeId?: string; coverLetter?: string }) =>
    apiClient.post<Application>('/applications', payload).then((r) => r.data),

  listMine: () => apiClient.get<Application[]>('/applications/mine').then((r) => r.data),

  listForJob: (jobId: string) =>
    apiClient.get<Application[]>(`/applications/job/${jobId}`).then((r) => r.data),

  listAllForRecruiter: () =>
    apiClient.get<Application[]>('/applications/recruiter/mine').then((r) => r.data),

  updateStatus: (id: string, status: ApplicationStatus, recruiterNotes?: string) =>
    apiClient.patch<Application>(`/applications/${id}/status`, { status, recruiterNotes }).then((r) => r.data),
};
