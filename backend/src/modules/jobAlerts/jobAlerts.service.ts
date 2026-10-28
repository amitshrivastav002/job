import { AppError } from '../../common/AppError';
import { prisma } from '../../config/prisma';
import { jobAlertsRepository } from './jobAlerts.repository';
import type { CreateJobAlertInput } from './jobAlerts.schema';

const getJobSeekerProfileOrThrow = async (userId: string) => {
  const profile = await prisma.jobSeekerProfile.findUnique({ where: { userId } });
  if (!profile) throw AppError.forbidden('Job seeker profile not found');
  return profile;
};

export const jobAlertsService = {
  async list(userId: string) {
    const profile = await getJobSeekerProfileOrThrow(userId);
    return jobAlertsRepository.list(profile.id);
  },

  async create(userId: string, input: CreateJobAlertInput) {
    const profile = await getJobSeekerProfileOrThrow(userId);
    if (!input.keyword && !input.location && !input.jobType) {
      throw AppError.badRequest('Provide at least one alert criterion');
    }
    return jobAlertsRepository.create(profile.id, input);
  },

  async remove(userId: string, id: string) {
    const profile = await getJobSeekerProfileOrThrow(userId);
    const alert = await jobAlertsRepository.findOne(id);
    if (!alert || alert.jobSeekerProfileId !== profile.id) throw AppError.notFound('Job alert not found');
    await jobAlertsRepository.remove(id);
  },
};
