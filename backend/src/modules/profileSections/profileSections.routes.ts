import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import { profileSectionsController } from './profileSections.controller';

export const profileSectionsRouter = Router();

profileSectionsRouter.get(
  '/job-seeker/me/sections/:section',
  requireAuth,
  requireRole('JOB_SEEKER'),
  profileSectionsController.list,
);

profileSectionsRouter.post(
  '/job-seeker/me/sections/:section',
  requireAuth,
  requireRole('JOB_SEEKER'),
  profileSectionsController.create,
);

profileSectionsRouter.patch(
  '/job-seeker/me/sections/:section/:id',
  requireAuth,
  requireRole('JOB_SEEKER'),
  profileSectionsController.update,
);

profileSectionsRouter.delete(
  '/job-seeker/me/sections/:section/:id',
  requireAuth,
  requireRole('JOB_SEEKER'),
  profileSectionsController.remove,
);
