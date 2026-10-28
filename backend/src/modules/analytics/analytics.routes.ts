import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import { analyticsController } from './analytics.controller';

export const analyticsRouter = Router();

analyticsRouter.get('/recruiter', requireAuth, requireRole('RECRUITER'), analyticsController.recruiterStats);
analyticsRouter.get('/admin', requireAuth, requireRole('ADMIN'), analyticsController.adminStats);
