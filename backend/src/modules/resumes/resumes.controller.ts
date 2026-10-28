import type { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { AppError } from '../../common/AppError';
import { resumesService } from './resumes.service';

export const resumesController = {
  upload: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    if (!req.file) throw AppError.badRequest('No file uploaded');
    const resume = await resumesService.upload(req.user.id, req.file);
    res.status(201).json(resume);
  }),

  listMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(200).json(await resumesService.listMine(req.user.id));
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    await resumesService.remove(req.user.id, req.params.id);
    res.status(204).send();
  }),
};
