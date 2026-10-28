import { z } from 'zod';

export const jobTypeEnum = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']);

export const createJobAlertSchema = z.object({
  keyword: z.string().min(1).max(160).optional(),
  location: z.string().min(1).max(160).optional(),
  jobType: jobTypeEnum.optional(),
});

export const jobAlertIdParamSchema = z.object({ id: z.string().uuid() });

export type CreateJobAlertInput = z.infer<typeof createJobAlertSchema>;
