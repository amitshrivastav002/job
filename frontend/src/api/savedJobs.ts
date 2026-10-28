import { apiClient } from '@/lib/apiClient';
import type { SavedJob } from '@/types';

export const savedJobsApi = {
  list: () => apiClient.get<SavedJob[]>('/saved-jobs').then((r) => r.data),

  save: (jobId: string) => apiClient.post<SavedJob>('/saved-jobs', { jobId }).then((r) => r.data),

  remove: (jobId: string) => apiClient.delete(`/saved-jobs/${jobId}`).then((r) => r.data),
};
