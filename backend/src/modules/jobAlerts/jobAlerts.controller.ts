import type { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { AppError } from '../../common/AppError';
import { jobAlertsService } from './jobAlerts.service';

export const jobAlertsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(200).json(await jobAlertsService.list(req.user.id));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(201).json(await jobAlertsService.create(req.user.id, req.body));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    await jobAlertsService.remove(req.user.id, req.params.id);
    res.status(204).send();
  }),
};
