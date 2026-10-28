import { prisma } from '../../config/prisma';
import type { NotificationType } from '@prisma/client';

export const notificationsRepository = {
  create: (userId: string, type: NotificationType, title: string, message: string, metadata?: object) =>
    prisma.notification.create({ data: { userId, type, title, message, metadata } }),

  listForUser: (userId: string) =>
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 100 }),

  markRead: (id: string, userId: string) =>
    prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } }),

  markAllRead: (userId: string) =>
    prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } }),
};
