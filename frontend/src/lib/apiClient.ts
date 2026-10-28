import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';

const API_URL = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/+$/, '');

export const apiClient = axios.create({ baseURL: `${API_URL}/api/v1` });

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) throw new Error('No refresh token available');
  const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh`, { refreshToken });
  useAuthStore.getState().setAccessToken(data.accessToken);
  useAuthStore.setState({ refreshToken: data.refreshToken });
  return data.accessToken;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !(originalRequest as never as { _retry?: boolean })._retry) {
      (originalRequest as never as { _retry?: boolean })._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newToken = await refreshPromise;
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearSession();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export interface ApiErrorShape {
  error: { code: string; message: string; details?: unknown };
}

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorShape | undefined;
    if (data?.error?.message) return data.error.message;
  }
  return 'Something went wrong. Please try again.';
};
