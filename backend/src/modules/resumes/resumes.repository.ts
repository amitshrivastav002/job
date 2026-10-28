import { prisma } from '../../config/prisma';

export const resumesRepository = {
  create: (jobSeekerProfileId: string, fileName: string, fileUrl: string, isPrimary: boolean) =>
    prisma.resume.create({ data: { jobSeekerProfileId, fileName, fileUrl, isPrimary } }),

  listByJobSeeker: (jobSeekerProfileId: string) =>
    prisma.resume.findMany({ where: { jobSeekerProfileId }, orderBy: { createdAt: 'desc' } }),

  findById: (id: string) => prisma.resume.findUnique({ where: { id } }),

  unsetPrimary: (jobSeekerProfileId: string) =>
    prisma.resume.updateMany({ where: { jobSeekerProfileId }, data: { isPrimary: false } }),

  delete: (id: string) => prisma.resume.delete({ where: { id } }),
};
