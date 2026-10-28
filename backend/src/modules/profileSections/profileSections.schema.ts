import { z } from 'zod';

export const SECTION_KEYS = [
  'experiences',
  'educations',
  'projects',
  'certifications',
  'achievements',
  'languages',
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

const dateInput = z
  .union([z.string(), z.date()])
  .transform((v) => new Date(v));

export const sectionSchemas: Record<SectionKey, z.ZodObject<any>> = {
  experiences: z.object({
    title: z.string().min(1).max(160),
    company: z.string().min(1).max(160),
    location: z.string().max(120).optional(),
    startDate: dateInput,
    endDate: dateInput.optional(),
    isCurrent: z.boolean().optional(),
    description: z.string().max(2000).optional(),
  }),
  educations: z.object({
    institution: z.string().min(1).max(160),
    degree: z.string().min(1).max(160),
    fieldOfStudy: z.string().max(160).optional(),
    startDate: dateInput,
    endDate: dateInput.optional(),
    description: z.string().max(2000).optional(),
  }),
  projects: z.object({
    title: z.string().min(1).max(160),
    description: z.string().max(2000).optional(),
    url: z.string().url().max(300).optional(),
    techStack: z.array(z.string()).optional(),
  }),
  certifications: z.object({
    name: z.string().min(1).max(160),
    issuer: z.string().max(160).optional(),
    issueDate: dateInput.optional(),
    expiryDate: dateInput.optional(),
    credentialUrl: z.string().url().max(300).optional(),
  }),
  achievements: z.object({
    title: z.string().min(1).max(160),
    description: z.string().max(2000).optional(),
    date: dateInput.optional(),
  }),
  languages: z.object({
    name: z.string().min(1).max(80),
    proficiency: z.enum(['BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE']),
  }),
};
