import type { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { AppError } from '../../common/AppError';
import { applicationsService } from './applications.service';

export const applicationsController = {
  apply: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const application = await applicationsService.apply(req.user.id, req.body);
    res.status(201).json(application);
  }),

  listMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const applications = await applicationsService.listMine(req.user.id);
    res.status(200).json(applications);
  }),

  listAllForRecruiter: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(200).json(await applicationsService.listAllForRecruiter(req.user.id));
  }),

  listForJob: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const applications = await applicationsService.listForJob(req.user.id, req.params.jobId);
    res.status(200).json(applications);
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const application = await applicationsService.updateStatus(
      req.user.id,
      req.params.id,
      req.body.status,
      req.body.recruiterNotes,
    );
    res.status(200).json(application);
  }),
};
