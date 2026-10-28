import { apiClient } from '@/lib/apiClient';
import type { AuthUser } from '@/types';

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  registerJobSeeker: (payload: { email: string; password: string; fullName: string }) =>
    apiClient.post<AuthResponse>('/auth/register/job-seeker', payload).then((r) => r.data),

  registerRecruiter: (payload: {
    email: string;
    password: string;
    fullName: string;
    companyName: string;
  }) => apiClient.post<AuthResponse>('/auth/register/recruiter', payload).then((r) => r.data),

  login: (payload: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', payload).then((r) => r.data),

  logout: (refreshToken: string) => apiClient.post('/auth/logout', { refreshToken }),

  oauthGoogle: (payload: {
    idToken: string;
    role?: 'JOB_SEEKER' | 'RECRUITER';
    fullName?: string;
    companyName?: string;
  }) => apiClient.post<AuthResponse>('/auth/oauth/google', payload).then((r) => r.data),

  oauthApple: (payload: {
    idToken: string;
    role?: 'JOB_SEEKER' | 'RECRUITER';
    fullName?: string;
    companyName?: string;
  }) => apiClient.post<AuthResponse>('/auth/oauth/apple', payload).then((r) => r.data),
};
