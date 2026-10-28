import type { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { AppError } from '../../common/AppError';
import { profilesService } from './profiles.service';

export const profilesController = {
  getMyJobSeekerProfile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(200).json(await profilesService.getJobSeekerProfile(req.user.id));
  }),

  updateMyJobSeekerProfile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(200).json(await profilesService.updateJobSeekerProfile(req.user.id, req.body));
  }),

  getMyRecruiterProfile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(200).json(await profilesService.getRecruiterProfile(req.user.id));
  }),

  updateMyRecruiterProfile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(200).json(await profilesService.updateRecruiterProfile(req.user.id, req.body));
  }),

  uploadMyJobSeekerPhoto: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    if (!req.file) throw AppError.badRequest('No file uploaded');
    res.status(200).json(await profilesService.uploadJobSeekerPhoto(req.user.id, req.file));
  }),
};
