import { apiClient } from '@/lib/apiClient';
import type { Job, JobType, PaginatedResult, RecommendedJob } from '@/types';

export interface JobSearchParams {
  q?: string;
  location?: string;
  type?: JobType;
  isRemote?: boolean;
  minSalary?: number;
  skills?: string;
  page?: number;
  pageSize?: number;
}

export type CreateJobPayload = Pick<
  Job,
  'title' | 'description' | 'type' | 'skills' | 'isRemote'
> &
  Partial<Pick<Job, 'location' | 'requirements' | 'minSalary' | 'maxSalary' | 'currency' | 'applicationDeadline'>>;

export const jobsApi = {
  search: (params: JobSearchParams) =>
    apiClient.get<PaginatedResult<Job>>('/jobs', { params }).then((r) => r.data),

  getById: (id: string) => apiClient.get<Job>(`/jobs/${id}`).then((r) => r.data),

  listMine: () => apiClient.get<Job[]>('/jobs/mine').then((r) => r.data),

  recommended: () => apiClient.get<RecommendedJob[]>('/jobs/recommended').then((r) => r.data),

  create: (payload: CreateJobPayload) => apiClient.post<Job>('/jobs', payload).then((r) => r.data),

  update: (id: string, payload: Partial<CreateJobPayload>) =>
    apiClient.patch<Job>(`/jobs/${id}`, payload).then((r) => r.data),

  publish: (id: string) => apiClient.post<Job>(`/jobs/${id}/publish`).then((r) => r.data),

  close: (id: string) => apiClient.post<Job>(`/jobs/${id}/close`).then((r) => r.data),
};
