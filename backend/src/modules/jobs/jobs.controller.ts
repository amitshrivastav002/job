import type { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { AppError } from '../../common/AppError';
import { jobsService } from './jobs.service';

export const jobsController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const job = await jobsService.create(req.user.id, req.body);
    res.status(201).json(job);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const job = await jobsService.update(req.user.id, req.params.id, req.body);
    res.status(200).json(job);
  }),

  publish: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const job = await jobsService.publish(req.user.id, req.params.id);
    res.status(200).json(job);
  }),

  close: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const job = await jobsService.close(req.user.id, req.params.id);
    res.status(200).json(job);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const job = await jobsService.getById(req.params.id);
    res.status(200).json(job);
  }),

  listMine: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    const jobs = await jobsService.listMine(req.user.id);
    res.status(200).json(jobs);
  }),

  search: asyncHandler(async (req: Request, res: Response) => {
    const result = await jobsService.search(req.query as never);
    res.status(200).json(result);
  }),

  recommended: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(200).json(await jobsService.recommended(req.user.id));
  }),
};
