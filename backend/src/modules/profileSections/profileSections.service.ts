import { AppError } from '../../common/AppError';
import { prisma } from '../../config/prisma';
import { profileSectionsRepository } from './profileSections.repository';
import { sectionSchemas, SECTION_KEYS, type SectionKey } from './profileSections.schema';

const getJobSeekerProfileOrThrow = async (userId: string) => {
  const profile = await prisma.jobSeekerProfile.findUnique({ where: { userId } });
  if (!profile) throw AppError.forbidden('Job seeker profile not found');
  return profile;
};

const assertSection = (section: string): SectionKey => {
  if (!SECTION_KEYS.includes(section as SectionKey)) throw AppError.notFound('Unknown profile section');
  return section as SectionKey;
};

const assertOwnership = async (section: SectionKey, id: string, jobSeekerProfileId: string) => {
  const existing = await profileSectionsRepository.findOne(section, id);
  if (!existing || existing.jobSeekerProfileId !== jobSeekerProfileId) {
    throw AppError.notFound('Entry not found');
  }
  return existing;
};

export const profileSectionsService = {
  async list(userId: string, section: string) {
    const key = assertSection(section);
    const profile = await getJobSeekerProfileOrThrow(userId);
    return profileSectionsRepository.list(key, profile.id);
  },

  async create(userId: string, section: string, body: unknown) {
    const key = assertSection(section);
    const profile = await getJobSeekerProfileOrThrow(userId);
    const parsed = sectionSchemas[key].safeParse(body);
    if (!parsed.success) throw AppError.badRequest('Invalid request body', parsed.error.flatten());
    return profileSectionsRepository.create(key, profile.id, parsed.data);
  },

  async update(userId: string, section: string, id: string, body: unknown) {
    const key = assertSection(section);
    const profile = await getJobSeekerProfileOrThrow(userId);
    await assertOwnership(key, id, profile.id);
    const parsed = sectionSchemas[key].partial().safeParse(body);
    if (!parsed.success) throw AppError.badRequest('Invalid request body', parsed.error.flatten());
    return profileSectionsRepository.update(key, id, parsed.data);
  },

  async remove(userId: string, section: string, id: string) {
    const key = assertSection(section);
    const profile = await getJobSeekerProfileOrThrow(userId);
    await assertOwnership(key, id, profile.id);
    await profileSectionsRepository.remove(key, id);
  },
};
