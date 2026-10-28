import { prisma } from '../../config/prisma';
import type { UpdateCompanyInput } from './companies.schema';

export const companiesRepository = {
  list: () => prisma.company.findMany({ orderBy: { name: 'asc' } }),

  findBySlug: (slug: string) =>
    prisma.company.findUnique({
      where: { slug },
      include: { jobs: { where: { status: 'PUBLISHED' } } },
    }),

  findById: (id: string) => prisma.company.findUnique({ where: { id } }),

  update: (id: string, data: UpdateCompanyInput) => prisma.company.update({ where: { id }, data }),
};
