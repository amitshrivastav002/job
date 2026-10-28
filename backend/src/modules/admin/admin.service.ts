import { env } from '../../config/env';
import { adminRepository } from './admin.repository';

export const adminService = {
  async listCompanies(page: number, pageSize: number) {
    const [items, total] = await adminRepository.listCompanies(page, pageSize);
    return { items, total, page, pageSize };
  },

  getSettings() {
    return {
      nodeEnv: env.NODE_ENV,
      corsOrigin: env.CORS_ORIGIN,
      rateLimit: { windowMs: env.RATE_LIMIT_WINDOW_MS, max: env.RATE_LIMIT_MAX },
      accessTokenExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
      refreshTokenExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
      googleOAuthEnabled: Boolean(env.GOOGLE_CLIENT_ID),
      appleOAuthEnabled: Boolean(env.APPLE_CLIENT_ID),
    };
  },

  async listUsers(page: number, pageSize: number) {
    const [items, total] = await adminRepository.listUsers(page, pageSize);
    return { items, total, page, pageSize };
  },

  async listJobs(page: number, pageSize: number) {
    const [items, total] = await adminRepository.listJobs(page, pageSize);
    return { items, total, page, pageSize };
  },

  setUserActive: (id: string, isActive: boolean) => adminRepository.setUserActive(id, isActive),

  verifyCompany: (id: string) => adminRepository.verifyCompany(id),
};
