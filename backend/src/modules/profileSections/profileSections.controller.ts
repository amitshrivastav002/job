import type { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { AppError } from '../../common/AppError';
import { profileSectionsService } from './profileSections.service';

export const profileSectionsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(200).json(await profileSectionsService.list(req.user.id, req.params.section));
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res
      .status(201)
      .json(await profileSectionsService.create(req.user.id, req.params.section, req.body));
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res
      .status(200)
      .json(
        await profileSectionsService.update(req.user.id, req.params.section, req.params.id, req.body),
      );
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    await profileSectionsService.remove(req.user.id, req.params.section, req.params.id);
    res.status(204).send();
  }),
};
