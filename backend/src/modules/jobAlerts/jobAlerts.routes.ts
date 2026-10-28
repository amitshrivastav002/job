import { Router } from 'express';
import { validate } from '../../common/validate';
import { requireAuth, requireRole } from '../../middleware/auth';
import { jobAlertsController } from './jobAlerts.controller';
import { createJobAlertSchema, jobAlertIdParamSchema } from './jobAlerts.schema';

export const jobAlertsRouter = Router();

jobAlertsRouter.use(requireAuth, requireRole('JOB_SEEKER'));

jobAlertsRouter.get('/', jobAlertsController.list);
jobAlertsRouter.post('/', validate({ body: createJobAlertSchema }), jobAlertsController.create);
jobAlertsRouter.delete('/:id', validate({ params: jobAlertIdParamSchema }), jobAlertsController.remove);
