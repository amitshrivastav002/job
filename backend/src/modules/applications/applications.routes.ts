import { Router } from 'express';
import { validate } from '../../common/validate';
import { requireAuth, requireRole } from '../../middleware/auth';
import { applicationsController } from './applications.controller';
import {
  applicationIdParamSchema,
  createApplicationSchema,
  updateApplicationStatusSchema,
} from './applications.schema';

export const applicationsRouter = Router();

applicationsRouter.post(
  '/',
  requireAuth,
  requireRole('JOB_SEEKER'),
  validate({ body: createApplicationSchema }),
  applicationsController.apply,
);

applicationsRouter.get('/mine', requireAuth, requireRole('JOB_SEEKER'), applicationsController.listMine);

applicationsRouter.get(
  '/recruiter/mine',
  requireAuth,
  requireRole('RECRUITER'),
  applicationsController.listAllForRecruiter,
);

applicationsRouter.get(
  '/job/:jobId',
  requireAuth,
  requireRole('RECRUITER'),
  applicationsController.listForJob,
);

applicationsRouter.patch(
  '/:id/status',
  requireAuth,
  requireRole('RECRUITER'),
  validate({ params: applicationIdParamSchema, body: updateApplicationStatusSchema }),
  applicationsController.updateStatus,
);
