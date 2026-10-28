import { prisma } from '../../config/prisma';
import type { SectionKey } from './profileSections.schema';

const delegates: Record<SectionKey, any> = {
  experiences: prisma.experience,
  educations: prisma.education,
  projects: prisma.project,
  certifications: prisma.certification,
  achievements: prisma.achievement,
  languages: prisma.language,
};

export const profileSectionsRepository = {
  list: (section: SectionKey, jobSeekerProfileId: string) =>
    delegates[section].findMany({ where: { jobSeekerProfileId } }),

  findOne: (section: SectionKey, id: string) => delegates[section].findUnique({ where: { id } }),

  create: (section: SectionKey, jobSeekerProfileId: string, data: Record<string, unknown>) =>
    delegates[section].create({ data: { ...data, jobSeekerProfileId } }),

  update: (section: SectionKey, id: string, data: Record<string, unknown>) =>
    delegates[section].update({ where: { id }, data }),

  remove: (section: SectionKey, id: string) => delegates[section].delete({ where: { id } }),
};
