import { z } from 'zod';

export const updateJobSeekerProfileSchema = z.object({
  firstName: z.string().min(1).max(60).optional(),
  lastName: z.string().min(1).max(60).optional(),
  headline: z.string().max(160).optional(),
  location: z.string().max(120).optional(),
  phone: z.string().max(30).optional(),
  skills: z.array(z.string()).optional(),
  summary: z.string().max(2000).optional(),
  githubUrl: z.string().url().max(300).optional(),
  linkedinUrl: z.string().url().max(300).optional(),
  portfolioUrl: z.string().url().max(300).optional(),
  preferredLocations: z.array(z.string()).optional(),
  workPreference: z.enum(['REMOTE', 'HYBRID', 'ON_SITE']).nullable().optional(),
  expectedSalary: z.number().int().positive().nullable().optional(),
  noticePeriod: z.string().max(60).optional(),
  employmentPreferences: z
    .array(z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']))
    .optional(),
  isPublic: z.boolean().optional(),
  isVisibleToRecruiters: z.boolean().optional(),
});

export const updateRecruiterProfileSchema = z.object({
  fullName: z.string().min(2).max(120).optional(),
  title: z.string().max(160).optional(),
  phone: z.string().max(30).optional(),
});

export type UpdateJobSeekerProfileInput = z.infer<typeof updateJobSeekerProfileSchema>;
export type UpdateRecruiterProfileInput = z.infer<typeof updateRecruiterProfileSchema>;
