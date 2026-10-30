import { apiClient } from '@/lib/apiClient';
import type { AtsResult, Job, Resume } from '@/types';

export const resumesApi = {
  list: () => apiClient.get<Resume[]>('/resumes').then((r) => r.data),

  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<Resume>('/resumes', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },

  remove: (id: string) => apiClient.delete<void>(`/resumes/${id}`).then((r) => r.data),

  atsCheck: (id: string, role: Pick<Job, 'title' | 'description' | 'requirements' | 'skills'>) =>
    apiClient.post<AtsResult>(`/resumes/${id}/ats`, role).then((r) => r.data),
};
