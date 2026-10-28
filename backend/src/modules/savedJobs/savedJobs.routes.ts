import { Router } from 'express';
import { validate } from '../../common/validate';
import { requireAuth, requireRole } from '../../middleware/auth';
import { savedJobsController } from './savedJobs.controller';
import { jobIdParamSchema, saveJobSchema } from './savedJobs.schema';

export const savedJobsRouter = Router();

savedJobsRouter.use(requireAuth, requireRole('JOB_SEEKER'));

savedJobsRouter.get('/', savedJobsController.list);
savedJobsRouter.post('/', validate({ body: saveJobSchema }), savedJobsController.save);
savedJobsRouter.delete('/:jobId', validate({ params: jobIdParamSchema }), savedJobsController.remove);
