import { z } from 'zod';

export const saveJobSchema = z.object({ jobId: z.string().uuid() });
export const jobIdParamSchema = z.object({ jobId: z.string().uuid() });

export type SaveJobInput = z.infer<typeof saveJobSchema>;
