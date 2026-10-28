import { AppError } from '../../common/AppError';
import { profilesRepository } from './profiles.repository';
import type { UpdateJobSeekerProfileInput, UpdateRecruiterProfileInput } from './profiles.schema';

const JOB_SEEKER_COMPLETION_CHECKS: Array<(p: NonNullable<Awaited<ReturnType<typeof profilesRepository.getJobSeekerByUserId>>>) => boolean> = [
  (p) => !!p.photoUrl,
  (p) => !!p.headline,
  (p) => !!p.summary,
  (p) => p.skills.length > 0,
  (p) => p.experiences.length > 0,
  (p) => p.educations.length > 0,
  (p) => p.projects.length > 0,
  (p) => p.certifications.length > 0,
  (p) => p.achievements.length > 0,
  (p) => p.languages.length > 0,
  (p) => p.preferredLocations.length > 0,
  (p) => !!p.workPreference,
  (p) => !!p.expectedSalary,
  (p) => !!p.noticePeriod,
  (p) => p.employmentPreferences.length > 0,
  (p) => !!p.githubUrl || !!p.linkedinUrl || !!p.portfolioUrl,
  (p) => p.resumes.length > 0,
];

const computeCompletionPercentage = (
  profile: NonNullable<Awaited<ReturnType<typeof profilesRepository.getJobSeekerByUserId>>>,
) => {
  const met = JOB_SEEKER_COMPLETION_CHECKS.filter((check) => check(profile)).length;
  return Math.round((met / JOB_SEEKER_COMPLETION_CHECKS.length) * 100);
};

export const profilesService = {
  async getJobSeekerProfile(userId: string) {
    const profile = await profilesRepository.getJobSeekerByUserId(userId);
    if (!profile) throw AppError.notFound('Job seeker profile not found');
    return { ...profile, completionPercentage: computeCompletionPercentage(profile) };
  },

  updateJobSeekerProfile(userId: string, input: UpdateJobSeekerProfileInput) {
    return profilesRepository.updateJobSeekerByUserId(userId, input);
  },

  async getRecruiterProfile(userId: string) {
    const profile = await profilesRepository.getRecruiterByUserId(userId);
    if (!profile) throw AppError.notFound('Recruiter profile not found');
    return profile;
  },

  updateRecruiterProfile(userId: string, input: UpdateRecruiterProfileInput) {
    return profilesRepository.updateRecruiterByUserId(userId, input);
  },

  uploadJobSeekerPhoto(userId: string, file: Express.Multer.File) {
    const photoUrl = `/uploads/photos/${file.filename}`;
    return profilesRepository.updateJobSeekerPhoto(userId, photoUrl);
  },
};
