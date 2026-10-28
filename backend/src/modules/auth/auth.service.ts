import argon2 from 'argon2';
import ms from 'ms';
import type { OAuthProvider } from '@prisma/client';
import { AppError } from '../../common/AppError';
import { slugify } from '../../utils/slugify';
import { hashToken } from '../../utils/hashToken';
import { authRepository } from './auth.repository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './jwt';
import { verifyGoogleIdToken, verifyAppleIdToken } from './oauth';
import { env } from '../../config/env';
import type {
  LoginInput,
  OAuthLoginInput,
  RegisterJobSeekerInput,
  RegisterRecruiterInput,
} from './auth.schema';

const issueTokenPair = async (userId: string, role: 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN') => {
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = signRefreshToken({ sub: userId });
  const expiresAt = new Date(Date.now() + ms(env.JWT_REFRESH_EXPIRES_IN));
  await authRepository.storeRefreshToken(userId, hashToken(refreshToken), expiresAt);
  return { accessToken, refreshToken };
};

export const authService = {
  async registerJobSeeker(input: RegisterJobSeekerInput) {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) throw AppError.conflict('An account with this email already exists');

    const passwordHash = await argon2.hash(input.password);
    const user = await authRepository.createJobSeeker(input.email, passwordHash, input.fullName);
    const tokens = await issueTokenPair(user.id, 'JOB_SEEKER');
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  },

  async registerRecruiter(input: RegisterRecruiterInput) {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) throw AppError.conflict('An account with this email already exists');

    const company = await authRepository.findOrCreateCompanyBySlug(
      input.companyName,
      slugify(input.companyName),
    );
    const passwordHash = await argon2.hash(input.password);
    const user = await authRepository.createRecruiter(
      input.email,
      passwordHash,
      input.fullName,
      company.id,
    );
    const tokens = await issueTokenPair(user.id, 'RECRUITER');
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  },

  async login(input: LoginInput) {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user || !user.passwordHash || !(await argon2.verify(user.passwordHash, input.password))) {
      throw AppError.unauthorized('Invalid email or password');
    }
    if (!user.isActive) {
      throw AppError.forbidden('This account has been suspended');
    }
    const tokens = await issueTokenPair(user.id, user.role);
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  },

  async oauthLogin(provider: OAuthProvider, input: OAuthLoginInput) {
    const profile =
      provider === 'GOOGLE'
        ? await verifyGoogleIdToken(input.idToken)
        : await verifyAppleIdToken(input.idToken);

    let user = await authRepository.findUserByOAuth(provider, profile.providerId);

    if (!user) {
      const existingByEmail = await authRepository.findUserByEmail(profile.email);
      if (existingByEmail) {
        if (existingByEmail.oauthProvider && existingByEmail.oauthProvider !== provider) {
          throw AppError.conflict('This email is already linked to a different social login');
        }
        user = await authRepository.linkOAuthToUser(existingByEmail.id, provider, profile.providerId);
      } else {
        const role = input.role ?? 'JOB_SEEKER';
        const fullName = input.fullName ?? profile.email.split('@')[0];
        if (role === 'RECRUITER') {
          if (!input.companyName) throw AppError.badRequest('companyName is required to sign up as a recruiter');
          const company = await authRepository.findOrCreateCompanyBySlug(
            input.companyName,
            slugify(input.companyName),
          );
          user = await authRepository.createRecruiter(profile.email, null, fullName, company.id, {
            provider,
            id: profile.providerId,
          });
        } else {
          user = await authRepository.createJobSeeker(profile.email, null, fullName, {
            provider,
            id: profile.providerId,
          });
        }
      }
    }

    if (!user.isActive) {
      throw AppError.forbidden('This account has been suspended');
    }

    const tokens = await issueTokenPair(user.id, user.role);
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  },

  async refresh(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw AppError.unauthorized('Invalid or expired refresh token');
    }

    const tokenHash = hashToken(refreshToken);
    const stored = await authRepository.findRefreshToken(tokenHash);
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw AppError.unauthorized('Invalid or expired refresh token');
    }

    const user = await authRepository.findUserById(payload.sub);
    if (!user || !user.isActive) {
      throw AppError.unauthorized('Account not found or inactive');
    }

    await authRepository.revokeRefreshToken(tokenHash);
    return issueTokenPair(user.id, user.role);
  },

  async logout(refreshToken: string) {
    try {
      await authRepository.revokeRefreshToken(hashToken(refreshToken));
    } catch {
      // token already gone/invalid — logout is idempotent
    }
  },
};
