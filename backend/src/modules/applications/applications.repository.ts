import { prisma } from '../../config/prisma';
import type { ApplicationStatus } from '@prisma/client';

export const applicationsRepository = {
  create: (jobId: string, jobSeekerProfileId: string, resumeId?: string, coverLetter?: string) =>
    prisma.application.create({
      data: { jobId, jobSeekerProfileId, resumeId, coverLetter },
    }),

  findById: (id: string) =>
    prisma.application.findUnique({
      where: { id },
      include: { job: true, jobSeekerProfile: true },
    }),

  findExisting: (jobId: string, jobSeekerProfileId: string) =>
    prisma.application.findUnique({ where: { jobId_jobSeekerProfileId: { jobId, jobSeekerProfileId } } }),

  listByJobSeeker: (jobSeekerProfileId: string) =>
    prisma.application.findMany({
      where: { jobSeekerProfileId },
      include: { job: { include: { company: true } } },
      orderBy: { appliedAt: 'desc' },
    }),

  listByRecruiter: (recruiterId: string) =>
    prisma.application.findMany({
      where: { job: { recruiterId } },
      include: { job: { include: { company: true } }, jobSeekerProfile: true },
      orderBy: { appliedAt: 'desc' },
    }),

  listByJob: (jobId: string) =>
    prisma.application.findMany({
      where: { jobId },
      include: { jobSeekerProfile: true },
      orderBy: { appliedAt: 'desc' },
    }),

  updateStatus: (id: string, status: ApplicationStatus, recruiterNotes?: string) =>
    prisma.application.update({ where: { id }, data: { status, recruiterNotes } }),
};
