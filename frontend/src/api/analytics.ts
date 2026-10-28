import { apiClient } from '@/lib/apiClient';
import type { AdminStats, RecruiterStats } from '@/types';

export const analyticsApi = {
  recruiterStats: () => apiClient.get<RecruiterStats>('/analytics/recruiter').then((r) => r.data),

  adminStats: () => apiClient.get<AdminStats>('/analytics/admin').then((r) => r.data),
};
