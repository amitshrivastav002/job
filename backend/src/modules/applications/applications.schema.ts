import { z } from 'zod';

export const applicationStatusEnum = z.enum([
  'APPLIED',
  'UNDER_REVIEW',
  'SHORTLISTED',
  'INTERVIEW',
  'OFFERED',
  'REJECTED',
  'WITHDRAWN',
]);

export const createApplicationSchema = z.object({
  jobId: z.string().uuid(),
  resumeId: z.string().uuid().optional(),
  coverLetter: z.string().max(5000).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: applicationStatusEnum,
  recruiterNotes: z.string().max(2000).optional(),
});

export const applicationIdParamSchema = z.object({ id: z.string().uuid() });

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
