import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.routes';
import { profilesRouter } from '../modules/profiles/profiles.routes';
import { companiesRouter } from '../modules/companies/companies.routes';
import { jobsRouter } from '../modules/jobs/jobs.routes';
import { applicationsRouter } from '../modules/applications/applications.routes';
import { resumesRouter } from '../modules/resumes/resumes.routes';
import { notificationsRouter } from '../modules/notifications/notifications.routes';
import { adminRouter } from '../modules/admin/admin.routes';
import { savedJobsRouter } from '../modules/savedJobs/savedJobs.routes';
import { jobAlertsRouter } from '../modules/jobAlerts/jobAlerts.routes';
import { analyticsRouter } from '../modules/analytics/analytics.routes';
import { profileSectionsRouter } from '../modules/profileSections/profileSections.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/profiles', profilesRouter);
apiRouter.use('/profiles', profileSectionsRouter);
apiRouter.use('/companies', companiesRouter);
apiRouter.use('/jobs', jobsRouter);
apiRouter.use('/applications', applicationsRouter);
apiRouter.use('/resumes', resumesRouter);
apiRouter.use('/notifications', notificationsRouter);
apiRouter.use('/admin', adminRouter);
apiRouter.use('/saved-jobs', savedJobsRouter);
apiRouter.use('/job-alerts', jobAlertsRouter);
apiRouter.use('/analytics', analyticsRouter);
