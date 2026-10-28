import { AppError } from '../../common/AppError';
import { prisma } from '../../config/prisma';
import { savedJobsRepository } from './savedJobs.repository';

const getJobSeekerProfileOrThrow = async (userId: string) => {
  const profile = await prisma.jobSeekerProfile.findUnique({ where: { userId } });
  if (!profile) throw AppError.forbidden('Job seeker profile not found');
  return profile;
};

export const savedJobsService = {
  async list(userId: string) {
    const profile = await getJobSeekerProfileOrThrow(userId);
    return savedJobsRepository.list(profile.id);
  },

  async save(userId: string, jobId: string) {
    const profile = await getJobSeekerProfileOrThrow(userId);
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw AppError.notFound('Job not found');
    const existing = await savedJobsRepository.findOne(profile.id, jobId);
    if (existing) return existing;
    return savedJobsRepository.save(profile.id, jobId);
  },

  async remove(userId: string, jobId: string) {
    const profile = await getJobSeekerProfileOrThrow(userId);
    const existing = await savedJobsRepository.findOne(profile.id, jobId);
    if (!existing) throw AppError.notFound('Saved job not found');
    await savedJobsRepository.remove(profile.id, jobId);
  },
};
