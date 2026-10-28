import { apiClient } from '@/lib/apiClient';
import type { JobAlert, JobType } from '@/types';

export const jobAlertsApi = {
  list: () => apiClient.get<JobAlert[]>('/job-alerts').then((r) => r.data),

  create: (payload: { keyword?: string; location?: string; jobType?: JobType }) =>
    apiClient.post<JobAlert>('/job-alerts', payload).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/job-alerts/${id}`).then((r) => r.data),
};
