import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import type { CreateJobInput, JobSearchQuery, UpdateJobInput } from './jobs.schema';

export const jobsRepository = {
  create: (recruiterId: string, companyId: string, data: CreateJobInput) =>
    prisma.job.create({
      data: { ...data, recruiterId, companyId },
    }),

  update: (id: string, data: UpdateJobInput) => prisma.job.update({ where: { id }, data }),

  findById: (id: string) =>
    prisma.job.findUnique({
      where: { id },
      include: { company: true, recruiter: true },
    }),

  publish: (id: string) =>
    prisma.job.update({ where: { id }, data: { status: 'PUBLISHED', publishedAt: new Date() } }),

  close: (id: string) => prisma.job.update({ where: { id }, data: { status: 'CLOSED' } }),

  listByRecruiter: (recruiterId: string) =>
    prisma.job.findMany({ where: { recruiterId }, orderBy: { createdAt: 'desc' } }),

  findCandidatesForSkills: (skills: string[]) =>
    prisma.job.findMany({
      where: { status: 'PUBLISHED', skills: { hasSome: skills } },
      include: { company: true },
      orderBy: { publishedAt: 'desc' },
      take: 50,
    }),

  search: async (query: JobSearchQuery) => {
    const where: Prisma.JobWhereInput = {
      status: 'PUBLISHED',
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: 'insensitive' } },
              { description: { contains: query.q, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query.location ? { location: { contains: query.location, mode: 'insensitive' } } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.isRemote !== undefined ? { isRemote: query.isRemote } : {}),
      ...(query.minSalary !== undefined ? { minSalary: { gte: query.minSalary } } : {}),
      ...(query.skills && query.skills.length > 0 ? { skills: { hasSome: query.skills } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: { company: true },
        orderBy: { publishedAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      prisma.job.count({ where }),
    ]);

    return { items, total, page: query.page, pageSize: query.pageSize };
  },
};
