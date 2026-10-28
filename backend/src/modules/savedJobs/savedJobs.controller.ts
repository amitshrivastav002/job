import type { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { AppError } from '../../common/AppError';
import { savedJobsService } from './savedJobs.service';

export const savedJobsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(200).json(await savedJobsService.list(req.user.id));
  }),

  save: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(201).json(await savedJobsService.save(req.user.id, req.body.jobId));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    await savedJobsService.remove(req.user.id, req.params.jobId);
    res.status(204).send();
  }),
};
