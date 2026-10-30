import { z } from 'zod';

export const atsCheckSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(20000).optional(),
  requirements: z.string().max(20000).nullish(),
  skills: z.array(z.string().max(80)).max(60).optional(),
});
