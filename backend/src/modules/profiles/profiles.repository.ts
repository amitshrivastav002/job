import { prisma } from '../../config/prisma';
import type { UpdateJobSeekerProfileInput, UpdateRecruiterProfileInput } from './profiles.schema';

export const profilesRepository = {
  getJobSeekerByUserId: (userId: string) =>
    prisma.jobSeekerProfile.findUnique({
      where: { userId },
      include: {
        resumes: true,
        experiences: true,
        educations: true,
        projects: true,
        certifications: true,
        achievements: true,
        languages: true,
      },
    }),

  updateJobSeekerByUserId: (userId: string, data: UpdateJobSeekerProfileInput) =>
    prisma.jobSeekerProfile.update({ where: { userId }, data }),

  updateJobSeekerPhoto: (userId: string, photoUrl: string) =>
    prisma.jobSeekerProfile.update({ where: { userId }, data: { photoUrl } }),

  getRecruiterByUserId: (userId: string) =>
    prisma.recruiterProfile.findUnique({ where: { userId }, include: { company: true } }),

  updateRecruiterByUserId: (userId: string, data: UpdateRecruiterProfileInput) =>
    prisma.recruiterProfile.update({ where: { userId }, data }),
};
