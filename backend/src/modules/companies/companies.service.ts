import { AppError } from '../../common/AppError';
import { prisma } from '../../config/prisma';
import { companiesRepository } from './companies.repository';
import type { UpdateCompanyInput } from './companies.schema';

export const companiesService = {
  list: () => companiesRepository.list(),

  async getBySlug(slug: string) {
    const company = await companiesRepository.findBySlug(slug);
    if (!company) throw AppError.notFound('Company not found');
    return company;
  },

  async updateMine(userId: string, input: UpdateCompanyInput) {
    const recruiterProfile = await prisma.recruiterProfile.findUnique({ where: { userId } });
    if (!recruiterProfile?.companyId) throw AppError.forbidden('No company associated with this account');
    return companiesRepository.update(recruiterProfile.companyId, input);
  },
};
