import type { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { AppError } from '../../common/AppError';
import { analyticsService } from './analytics.service';

export const analyticsController = {
  recruiterStats: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(200).json(await analyticsService.recruiterStats(req.user.id));
  }),

  adminStats: asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json(await analyticsService.adminStats());
  }),
};
