import { Router } from 'express';
import { validate } from '../../common/validate';
import { requireAuth } from '../../middleware/auth';
import { authRateLimiter } from '../../middleware/rateLimit';
import { authController } from './auth.controller';
import {
  loginSchema,
  oauthLoginSchema,
  refreshSchema,
  registerJobSeekerSchema,
  registerRecruiterSchema,
} from './auth.schema';

export const authRouter = Router();

authRouter.post(
  '/register/job-seeker',
  authRateLimiter,
  validate({ body: registerJobSeekerSchema }),
  authController.registerJobSeeker,
);

authRouter.post(
  '/register/recruiter',
  authRateLimiter,
  validate({ body: registerRecruiterSchema }),
  authController.registerRecruiter,
);

authRouter.post('/login', authRateLimiter, validate({ body: loginSchema }), authController.login);

authRouter.post(
  '/oauth/google',
  authRateLimiter,
  validate({ body: oauthLoginSchema }),
  authController.googleLogin,
);

authRouter.post(
  '/oauth/apple',
  authRateLimiter,
  validate({ body: oauthLoginSchema }),
  authController.appleLogin,
);

authRouter.post('/refresh', validate({ body: refreshSchema }), authController.refresh);

authRouter.post('/logout', validate({ body: refreshSchema }), authController.logout);

authRouter.get('/me', requireAuth, authController.me);
