import { AppError } from '../../common/AppError';
import { prisma } from '../../config/prisma';
import { jobsRepository } from './jobs.repository';
import type { CreateJobInput, JobSearchQuery, UpdateJobInput } from './jobs.schema';

const getRecruiterProfileOrThrow = async (userId: string) => {
  const profile = await prisma.recruiterProfile.findUnique({ where: { userId } });
  if (!profile) throw AppError.forbidden('Recruiter profile not found');
  if (!profile.companyId) throw AppError.badRequest('Recruiter has no associated company');
  return profile;
};

const assertOwnsJob = async (jobId: string, recruiterId: string) => {
  const job = await jobsRepository.findById(jobId);
  if (!job) throw AppError.notFound('Job not found');
  if (job.recruiterId !== recruiterId) throw AppError.forbidden('You do not own this job posting');
  return job;
};

export const jobsService = {
  async create(userId: string, input: CreateJobInput) {
    const profile = await getRecruiterProfileOrThrow(userId);
    return jobsRepository.create(profile.id, profile.companyId as string, input);
  },

  async update(userId: string, jobId: string, input: UpdateJobInput) {
    const profile = await getRecruiterProfileOrThrow(userId);
    await assertOwnsJob(jobId, profile.id);
    return jobsRepository.update(jobId, input);
  },

  async publish(userId: string, jobId: string) {
    const profile = await getRecruiterProfileOrThrow(userId);
    await assertOwnsJob(jobId, profile.id);
    return jobsRepository.publish(jobId);
  },

  async close(userId: string, jobId: string) {
    const profile = await getRecruiterProfileOrThrow(userId);
    await assertOwnsJob(jobId, profile.id);
    return jobsRepository.close(jobId);
  },

  async getById(jobId: string) {
    const job = await jobsRepository.findById(jobId);
    if (!job) throw AppError.notFound('Job not found');
    return job;
  },

  async listMine(userId: string) {
    const profile = await getRecruiterProfileOrThrow(userId);
    return jobsRepository.listByRecruiter(profile.id);
  },

  search(query: JobSearchQuery) {
    return jobsRepository.search(query);
  },

  async recommended(userId: string) {
    const profile = await prisma.jobSeekerProfile.findUnique({ where: { userId } });
    if (!profile) throw AppError.forbidden('Job seeker profile not found');
    if (profile.skills.length === 0) return [];

    const candidates = await jobsRepository.findCandidatesForSkills(profile.skills);
    return candidates
      .map((job) => ({
        job,
        matchCount: job.skills.filter((s) => profile.skills.includes(s)).length,
      }))
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 20)
      .map(({ job, matchCount }) => ({ ...job, matchCount }));
  },
};
