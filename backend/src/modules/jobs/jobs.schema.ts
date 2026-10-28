import { z } from 'zod';

export const jobTypeEnum = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE']);
export const jobStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']);

export const createJobSchema = z.object({
  title: z.string().min(3).max(160),
  description: z.string().min(20),
  requirements: z.string().optional(),
  location: z.string().optional(),
  isRemote: z.boolean().default(false),
  type: jobTypeEnum,
  minSalary: z.number().int().nonnegative().optional(),
  maxSalary: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).optional(),
  skills: z.array(z.string()).default([]),
  applicationDeadline: z.coerce.date().optional(),
});

export const updateJobSchema = createJobSchema.partial();

export const jobSearchQuerySchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  type: jobTypeEnum.optional(),
  isRemote: z.coerce.boolean().optional(),
  minSalary: z.coerce.number().optional(),
  skills: z
    .string()
    .optional()
    .transform((v) => (v ? v.split(',').map((s) => s.trim()) : undefined)),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export const jobIdParamSchema = z.object({ id: z.string().uuid() });

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobSearchQuery = z.infer<typeof jobSearchQuerySchema>;
