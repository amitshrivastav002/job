import { AppError } from '../../common/AppError';
import { prisma } from '../../config/prisma';
import { notificationsService } from '../notifications/notifications.service';
import { applicationsRepository } from './applications.repository';
import type { ApplicationStatus } from '@prisma/client';
import type { CreateApplicationInput } from './applications.schema';

const getJobSeekerProfileOrThrow = async (userId: string) => {
  const profile = await prisma.jobSeekerProfile.findUnique({ where: { userId } });
  if (!profile) throw AppError.forbidden('Job seeker profile not found');
  return profile;
};

const getRecruiterProfileOrThrow = async (userId: string) => {
  const profile = await prisma.recruiterProfile.findUnique({ where: { userId } });
  if (!profile) throw AppError.forbidden('Recruiter profile not found');
  return profile;
};

export const applicationsService = {
  async apply(userId: string, input: CreateApplicationInput) {
    const profile = await getJobSeekerProfileOrThrow(userId);

    const job = await prisma.job.findUnique({ where: { id: input.jobId } });
    if (!job || job.status !== 'PUBLISHED') throw AppError.notFound('Job not found or not open for applications');
    if (job.applicationDeadline && job.applicationDeadline < new Date()) {
      throw AppError.badRequest('The application deadline for this job has passed');
    }

    const existing = await applicationsRepository.findExisting(input.jobId, profile.id);
    if (existing) throw AppError.conflict('You have already applied to this job');

    const application = await applicationsRepository.create(
      input.jobId,
      profile.id,
      input.resumeId,
      input.coverLetter,
    );

    const recruiter = await prisma.recruiterProfile.findUnique({ where: { id: job.recruiterId } });
    if (recruiter) {
      await notificationsService.notify(
        recruiter.userId,
        'APPLICATION_STATUS',
        'New application received',
        `${profile.firstName} ${profile.lastName} applied to "${job.title}"`,
        { jobId: job.id, applicationId: application.id },
      );
    }

    return application;
  },

  async listMine(userId: string) {
    const profile = await getJobSeekerProfileOrThrow(userId);
    return applicationsRepository.listByJobSeeker(profile.id);
  },

  async listAllForRecruiter(userId: string) {
    const recruiterProfile = await getRecruiterProfileOrThrow(userId);
    return applicationsRepository.listByRecruiter(recruiterProfile.id);
  },

  async listForJob(userId: string, jobId: string) {
    const recruiterProfile = await getRecruiterProfileOrThrow(userId);
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw AppError.notFound('Job not found');
    if (job.recruiterId !== recruiterProfile.id) throw AppError.forbidden('You do not own this job posting');
    return applicationsRepository.listByJob(jobId);
  },

  async updateStatus(userId: string, applicationId: string, status: ApplicationStatus, recruiterNotes?: string) {
    const recruiterProfile = await getRecruiterProfileOrThrow(userId);
    const application = await applicationsRepository.findById(applicationId);
    if (!application) throw AppError.notFound('Application not found');
    if (application.job.recruiterId !== recruiterProfile.id) {
      throw AppError.forbidden('You do not own the job for this application');
    }

    const updated = await applicationsRepository.updateStatus(applicationId, status, recruiterNotes);

    await notificationsService.notify(
      application.jobSeekerProfile.userId,
      'APPLICATION_STATUS',
      'Application status updated',
      `Your application for "${application.job.title}" is now ${status.replace('_', ' ').toLowerCase()}`,
      { jobId: application.jobId, applicationId },
    );

    return updated;
  },
};
