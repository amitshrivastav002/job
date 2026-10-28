import { prisma } from '../../config/prisma';
import type { OAuthProvider, Role } from '@prisma/client';

export const authRepository = {
  findUserByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

  findUserById: (id: string) => prisma.user.findUnique({ where: { id } }),

  findUserByOAuth: (oauthProvider: OAuthProvider, oauthId: string) =>
    prisma.user.findUnique({ where: { oauthProvider_oauthId: { oauthProvider, oauthId } } }),

  linkOAuthToUser: (userId: string, oauthProvider: OAuthProvider, oauthId: string) =>
    prisma.user.update({ where: { id: userId }, data: { oauthProvider, oauthId } }),

  createJobSeeker: (
    email: string,
    passwordHash: string | null,
    fullName: string,
    oauth?: { provider: OAuthProvider; id: string },
  ) => {
    const [firstName, ...rest] = fullName.trim().split(/\s+/);
    const lastName = rest.join(' ');
    return prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'JOB_SEEKER' as Role,
        oauthProvider: oauth?.provider,
        oauthId: oauth?.id,
        jobSeekerProfile: { create: { firstName: firstName || 'Unknown', lastName } },
      },
      include: { jobSeekerProfile: true },
    });
  },

  createRecruiter: (
    email: string,
    passwordHash: string | null,
    fullName: string,
    companyId: string,
    oauth?: { provider: OAuthProvider; id: string },
  ) =>
    prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'RECRUITER' as Role,
        oauthProvider: oauth?.provider,
        oauthId: oauth?.id,
        recruiterProfile: { create: { fullName, companyId } },
      },
      include: { recruiterProfile: true },
    }),

  findOrCreateCompanyBySlug: (name: string, slug: string) =>
    prisma.company.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    }),

  storeRefreshToken: (userId: string, tokenHash: string, expiresAt: Date) =>
    prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } }),

  findRefreshToken: (tokenHash: string) =>
    prisma.refreshToken.findUnique({ where: { tokenHash } }),

  revokeRefreshToken: (tokenHash: string) =>
    prisma.refreshToken.update({ where: { tokenHash }, data: { revokedAt: new Date() } }),
};
