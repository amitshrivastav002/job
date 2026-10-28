import { Router } from 'express';
import { validate } from '../../common/validate';
import { requireAuth, requireRole } from '../../middleware/auth';
import { jobsController } from './jobs.controller';
import { createJobSchema, jobIdParamSchema, jobSearchQuerySchema, updateJobSchema } from './jobs.schema';

export const jobsRouter = Router();

jobsRouter.get('/', validate({ query: jobSearchQuerySchema }), jobsController.search);

jobsRouter.get('/mine', requireAuth, requireRole('RECRUITER'), jobsController.listMine);

jobsRouter.get('/recommended', requireAuth, requireRole('JOB_SEEKER'), jobsController.recommended);

jobsRouter.get('/:id', validate({ params: jobIdParamSchema }), jobsController.getById);

jobsRouter.post(
  '/',
  requireAuth,
  requireRole('RECRUITER'),
  validate({ body: createJobSchema }),
  jobsController.create,
);

jobsRouter.patch(
  '/:id',
  requireAuth,
  requireRole('RECRUITER'),
  validate({ params: jobIdParamSchema, body: updateJobSchema }),
  jobsController.update,
);

jobsRouter.post(
  '/:id/publish',
  requireAuth,
  requireRole('RECRUITER'),
  validate({ params: jobIdParamSchema }),
  jobsController.publish,
);

jobsRouter.post(
  '/:id/close',
  requireAuth,
  requireRole('RECRUITER'),
  validate({ params: jobIdParamSchema }),
  jobsController.close,
);
