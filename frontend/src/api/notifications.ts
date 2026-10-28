import { apiClient } from '@/lib/apiClient';
import type { Notification } from '@/types';

export const notificationsApi = {
  list: () => apiClient.get<Notification[]>('/notifications').then((r) => r.data),

  markRead: (id: string) => apiClient.post<Notification>(`/notifications/${id}/read`).then((r) => r.data),

  markAllRead: () => apiClient.post<{ count: number }>('/notifications/read-all').then((r) => r.data),
};
