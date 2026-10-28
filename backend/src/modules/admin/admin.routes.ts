import { Router } from 'express';
import { validate } from '../../common/validate';
import { requireAuth, requireRole } from '../../middleware/auth';
import { adminController } from './admin.controller';
import {
  companyIdParamSchema,
  paginationQuerySchema,
  setUserActiveSchema,
  userIdParamSchema,
} from './admin.schema';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole('ADMIN'));

adminRouter.get('/users', validate({ query: paginationQuerySchema }), adminController.listUsers);

adminRouter.patch(
  '/users/:id/active',
  validate({ params: userIdParamSchema, body: setUserActiveSchema }),
  adminController.setUserActive,
);

adminRouter.get('/jobs', validate({ query: paginationQuerySchema }), adminController.listJobs);

adminRouter.get('/companies', validate({ query: paginationQuerySchema }), adminController.listCompanies);

adminRouter.post(
  '/companies/:id/verify',
  validate({ params: companyIdParamSchema }),
  adminController.verifyCompany,
);

adminRouter.get('/settings', adminController.getSettings);
