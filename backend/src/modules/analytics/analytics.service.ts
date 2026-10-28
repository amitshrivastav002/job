import { AppError } from '../../common/AppError';
import { prisma } from '../../config/prisma';

export const analyticsService = {
  async recruiterStats(userId: string) {
    const profile = await prisma.recruiterProfile.findUnique({ where: { userId } });
    if (!profile) throw AppError.forbidden('Recruiter profile not found');

    const [jobsByStatus, applicationsByStatus, totalJobs, totalApplicants] = await Promise.all([
      prisma.job.groupBy({ by: ['status'], where: { recruiterId: profile.id }, _count: true }),
      prisma.application.groupBy({
        by: ['status'],
        where: { job: { recruiterId: profile.id } },
        _count: true,
      }),
      prisma.job.count({ where: { recruiterId: profile.id } }),
      prisma.application.count({ where: { job: { recruiterId: profile.id } } }),
    ]);

    return {
      totalJobs,
      totalApplicants,
      jobsByStatus: jobsByStatus.map((r) => ({ status: r.status, count: r._count })),
      applicationsByStatus: applicationsByStatus.map((r) => ({ status: r.status, count: r._count })),
    };
  },

  async adminStats() {
    const [usersByRole, jobsByStatus, totalCompanies, totalApplications] = await Promise.all([
      prisma.user.groupBy({ by: ['role'], _count: true }),
      prisma.job.groupBy({ by: ['status'], _count: true }),
      prisma.company.count(),
      prisma.application.count(),
    ]);

    return {
      totalCompanies,
      totalApplications,
      usersByRole: usersByRole.map((r) => ({ role: r.role, count: r._count })),
      jobsByStatus: jobsByStatus.map((r) => ({ status: r.status, count: r._count })),
    };
  },
};
