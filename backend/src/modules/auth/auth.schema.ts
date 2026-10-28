import { z } from 'zod';

export const registerJobSeekerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  fullName: z.string().min(2).max(120),
});

export const registerRecruiterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  fullName: z.string().min(2).max(120),
  companyName: z.string().min(2).max(160),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const oauthLoginSchema = z.object({
  idToken: z.string().min(1),
  role: z.enum(['JOB_SEEKER', 'RECRUITER']).optional(),
  fullName: z.string().min(2).max(120).optional(),
  companyName: z.string().min(2).max(160).optional(),
});

export type RegisterJobSeekerInput = z.infer<typeof registerJobSeekerSchema>;
export type RegisterRecruiterInput = z.infer<typeof registerRecruiterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OAuthLoginInput = z.infer<typeof oauthLoginSchema>;
