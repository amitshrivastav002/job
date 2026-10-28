import { Router } from 'express';
import { validate } from '../../common/validate';
import { requireAuth, requireRole } from '../../middleware/auth';
import { profilesController } from './profiles.controller';
import { updateJobSeekerProfileSchema, updateRecruiterProfileSchema } from './profiles.schema';
import { photoUpload } from './profiles.upload';

export const profilesRouter = Router();

profilesRouter.get(
  '/job-seeker/me',
  requireAuth,
  requireRole('JOB_SEEKER'),
  profilesController.getMyJobSeekerProfile,
);

profilesRouter.patch(
  '/job-seeker/me',
  requireAuth,
  requireRole('JOB_SEEKER'),
  validate({ body: updateJobSeekerProfileSchema }),
  profilesController.updateMyJobSeekerProfile,
);

profilesRouter.post(
  '/job-seeker/me/photo',
  requireAuth,
  requireRole('JOB_SEEKER'),
  photoUpload.single('file'),
  profilesController.uploadMyJobSeekerPhoto,
);

profilesRouter.get(
  '/recruiter/me',
  requireAuth,
  requireRole('RECRUITER'),
  profilesController.getMyRecruiterProfile,
);

profilesRouter.patch(
  '/recruiter/me',
  requireAuth,
  requireRole('RECRUITER'),
  validate({ body: updateRecruiterProfileSchema }),
  profilesController.updateMyRecruiterProfile,
);
