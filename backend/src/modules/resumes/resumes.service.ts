import fs from 'fs/promises';
import { AppError } from '../../common/AppError';
import { prisma } from '../../config/prisma';
import { resumesRepository } from './resumes.repository';
import { extractText, scoreResume, type AtsRole } from './resumes.ats';
import { analyzeWithClaude } from './resumes.ai';

const getJobSeekerProfileOrThrow = async (userId: string) => {
  const profile = await prisma.jobSeekerProfile.findUnique({ where: { userId } });
  if (!profile) throw AppError.forbidden('Job seeker profile not found');
  return profile;
};

export const resumesService = {
  async upload(userId: string, file: Express.Multer.File) {
    const profile = await getJobSeekerProfileOrThrow(userId);
    const existing = await resumesRepository.listByJobSeeker(profile.id);
    const isPrimary = existing.length === 0;
    const fileUrl = `/uploads/resumes/${file.filename}`;
    return resumesRepository.create(profile.id, file.originalname, fileUrl, isPrimary);
  },

  async listMine(userId: string) {
    const profile = await getJobSeekerProfileOrThrow(userId);
    return resumesRepository.listByJobSeeker(profile.id);
  },

  async remove(userId: string, resumeId: string) {
    const profile = await getJobSeekerProfileOrThrow(userId);
    const resume = await resumesRepository.findById(resumeId);
    if (!resume || resume.jobSeekerProfileId !== profile.id) throw AppError.notFound('Resume not found');

    await resumesRepository.delete(resumeId);
    const filePath = `${process.cwd()}/uploads/resumes/${resume.fileUrl.split('/').pop()}`;
    await fs.unlink(filePath).catch(() => undefined);
  },

  async atsCheck(userId: string, resumeId: string, role: AtsRole) {
    const profile = await getJobSeekerProfileOrThrow(userId);
    const resume = await resumesRepository.findById(resumeId);
    if (!resume || resume.jobSeekerProfileId !== profile.id) throw AppError.notFound('Resume not found');

    const filePath = `${process.cwd()}/uploads/resumes/${resume.fileUrl.split('/').pop()}`;
    const text = await extractText(filePath);
    if (!text.trim()) throw AppError.badRequest('Could not read text from this resume (use PDF or DOCX)');

    return scoreResume(text, role, await analyzeWithClaude(text, role));
  },
};
