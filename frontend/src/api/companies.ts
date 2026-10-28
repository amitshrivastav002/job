import { apiClient } from '@/lib/apiClient';
import type { Company } from '@/types';

export const companiesApi = {
  list: () => apiClient.get<Company[]>('/companies').then((r) => r.data),

  getBySlug: (slug: string) => apiClient.get<Company>(`/companies/${slug}`).then((r) => r.data),

  updateMine: (payload: Partial<Pick<Company, 'name' | 'description' | 'website' | 'logoUrl'>>) =>
    apiClient.patch<Company>('/companies/me', payload).then((r) => r.data),
};
