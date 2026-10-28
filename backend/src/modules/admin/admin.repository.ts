import { prisma } from '../../config/prisma';

export const adminRepository = {
  listUsers: (page: number, pageSize: number) =>
    Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, email: true, role: true, isActive: true, createdAt: true },
      }),
      prisma.user.count(),
    ]),

  listJobs: (page: number, pageSize: number) =>
    Promise.all([
      prisma.job.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { company: true },
      }),
      prisma.job.count(),
    ]),

  listCompanies: (page: number, pageSize: number) =>
    Promise.all([
      prisma.company.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { _count: { select: { jobs: true, recruiters: true } } },
      }),
      prisma.company.count(),
    ]),

  setUserActive: (id: string, isActive: boolean) =>
    prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, email: true, role: true, isActive: true, createdAt: true },
    }),

  verifyCompany: (id: string) => prisma.company.update({ where: { id }, data: { isVerified: true } }),
};
