import { Router } from 'express';
import { validate } from '../../common/validate';
import { requireAuth, requireRole } from '../../middleware/auth';
import { companiesController } from './companies.controller';
import { companySlugParamSchema, updateCompanySchema } from './companies.schema';

export const companiesRouter = Router();

companiesRouter.get('/', companiesController.list);

companiesRouter.patch(
  '/me',
  requireAuth,
  requireRole('RECRUITER'),
  validate({ body: updateCompanySchema }),
  companiesController.updateMine,
);

companiesRouter.get('/:slug', validate({ params: companySlugParamSchema }), companiesController.getBySlug);
