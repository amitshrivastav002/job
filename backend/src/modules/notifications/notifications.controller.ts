import type { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { AppError } from '../../common/AppError';
import { notificationsService } from './notifications.service';

export const notificationsController = {
  listMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const notifications = await notificationsService.listMine(req.user.id);
    res.status(200).json(notifications);
  }),

  markRead: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    await notificationsService.markRead(req.params.id, req.user.id);
    res.status(204).send();
  }),

  markAllRead: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    await notificationsService.markAllRead(req.user.id);
    res.status(204).send();
  }),
};
