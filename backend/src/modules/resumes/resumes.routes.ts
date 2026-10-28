import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import { resumesController } from './resumes.controller';
import { resumeUpload } from './resumes.upload';

export const resumesRouter = Router();

resumesRouter.get('/', requireAuth, requireRole('JOB_SEEKER'), resumesController.listMine);

resumesRouter.post(
  '/',
  requireAuth,
  requireRole('JOB_SEEKER'),
  resumeUpload.single('file'),
  resumesController.upload,
);

resumesRouter.delete('/:id', requireAuth, requireRole('JOB_SEEKER'), resumesController.remove);
