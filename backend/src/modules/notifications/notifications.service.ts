import { logger } from '../../config/logger';
import { notificationsRepository } from './notifications.repository';
import type { NotificationType } from '@prisma/client';

export const notificationsService = {
  async notify(userId: string, type: NotificationType, title: string, message: string, metadata?: object) {
    const notification = await notificationsRepository.create(userId, type, title, message, metadata);
    // Email/push delivery is stubbed for Phase 0 — logged so the event is visible end-to-end.
    logger.info({ userId, type, title }, 'notification created (email delivery stubbed)');
    return notification;
  },

  listMine: (userId: string) => notificationsRepository.listForUser(userId),

  markRead: (id: string, userId: string) => notificationsRepository.markRead(id, userId),

  markAllRead: (userId: string) => notificationsRepository.markAllRead(userId),
};
