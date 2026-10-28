import { apiClient } from '@/lib/apiClient';
import { USE_DUMMY_DATA, dummyJobs } from './dummyJobs';
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
  search: async (params: JobSearchParams): Promise<PaginatedResult<Job>> => {
    const dummyResult = () => {
      const { page = 1, pageSize = 10 } = params;
      const q = params.q?.toLowerCase();
      const matches = dummyJobs.filter(
        (j) =>
          (!q || j.title.toLowerCase().includes(q)) &&
          (!params.type || j.type === params.type) &&
          (params.isRemote === undefined || j.isRemote === params.isRemote)
      );
      return { items: matches.slice((page - 1) * pageSize, page * pageSize), total: matches.length, page, pageSize };
    };
    try {
      const { data } = await apiClient.get<PaginatedResult<Job>>('/jobs', { params });
      return USE_DUMMY_DATA && data.total === 0 ? dummyResult() : data;
    } catch (err) {
      if (USE_DUMMY_DATA) return dummyResult();
      throw err;
    }
  },

  getById: (id: string) => {
    const dummy = USE_DUMMY_DATA ? dummyJobs.find((j) => j.id === id) : undefined;
    return dummy ? Promise.resolve(dummy) : apiClient.get<Job>(`/jobs/${id}`).then((r) => r.data);
  },

  listMine: () => apiClient.get<Job[]>('/jobs/mine').then((r) => r.data),

  recommended: () => apiClient.get<RecommendedJob[]>('/jobs/recommended').then((r) => r.data),

  create: (payload: CreateJobPayload) => apiClient.post<Job>('/jobs', payload).then((r) => r.data),

  update: (id: string, payload: Partial<CreateJobPayload>) =>
    apiClient.patch<Job>(`/jobs/${id}`, payload).then((r) => r.data),

  publish: (id: string) => apiClient.post<Job>(`/jobs/${id}/publish`).then((r) => r.data),

  close: (id: string) => apiClient.post<Job>(`/jobs/${id}/close`).then((r) => r.data),
};
