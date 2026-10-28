import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { notificationsController } from './notifications.controller';

export const notificationsRouter = Router();

notificationsRouter.get('/', requireAuth, notificationsController.listMine);
notificationsRouter.post('/read-all', requireAuth, notificationsController.markAllRead);
notificationsRouter.post('/:id/read', requireAuth, notificationsController.markRead);
