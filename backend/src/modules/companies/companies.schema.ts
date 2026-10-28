import { z } from 'zod';

export const updateCompanySchema = z.object({
  name: z.string().min(2).max(160).optional(),
  website: z.string().url().optional(),
  industry: z.string().max(120).optional(),
  size: z.string().max(60).optional(),
  description: z.string().max(3000).optional(),
  logoUrl: z.string().url().optional(),
});

export const companySlugParamSchema = z.object({ slug: z.string().min(1) });

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
