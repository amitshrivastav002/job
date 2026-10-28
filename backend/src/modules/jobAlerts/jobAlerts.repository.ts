import { prisma } from '../../config/prisma';
import type { CreateJobAlertInput } from './jobAlerts.schema';

export const jobAlertsRepository = {
  list: (jobSeekerProfileId: string) =>
    prisma.jobAlert.findMany({ where: { jobSeekerProfileId }, orderBy: { createdAt: 'desc' } }),

  create: (jobSeekerProfileId: string, data: CreateJobAlertInput) =>
    prisma.jobAlert.create({ data: { ...data, jobSeekerProfileId } }),

  findOne: (id: string) => prisma.jobAlert.findUnique({ where: { id } }),

  remove: (id: string) => prisma.jobAlert.delete({ where: { id } }),
};
