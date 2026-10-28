import type { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { AppError } from '../../common/AppError';
import { companiesService } from './companies.service';

export const companiesController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json(await companiesService.list());
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(await companiesService.getBySlug(req.params.slug));
  }),

  updateMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(200).json(await companiesService.updateMine(req.user.id, req.body));
  }),
};
