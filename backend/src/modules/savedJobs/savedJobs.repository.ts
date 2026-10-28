import { prisma } from '../../config/prisma';

export const savedJobsRepository = {
  list: (jobSeekerProfileId: string) =>
    prisma.savedJob.findMany({
      where: { jobSeekerProfileId },
      include: { job: { include: { company: true } } },
      orderBy: { createdAt: 'desc' },
    }),

  findOne: (jobSeekerProfileId: string, jobId: string) =>
    prisma.savedJob.findUnique({ where: { jobSeekerProfileId_jobId: { jobSeekerProfileId, jobId } } }),

  save: (jobSeekerProfileId: string, jobId: string) =>
    prisma.savedJob.create({ data: { jobSeekerProfileId, jobId } }),

  remove: (jobSeekerProfileId: string, jobId: string) =>
    prisma.savedJob.delete({ where: { jobSeekerProfileId_jobId: { jobSeekerProfileId, jobId } } }),
};
