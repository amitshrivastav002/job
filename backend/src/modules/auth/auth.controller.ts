import type { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { authService } from './auth.service';
import { AppError } from '../../common/AppError';

export const authController = {
  registerJobSeeker: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.registerJobSeeker(req.body);
    res.status(201).json(result);
  }),

  registerRecruiter: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.registerRecruiter(req.body);
    res.status(201).json(result);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  }),

  googleLogin: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.oauthLogin('GOOGLE', req.body);
    res.status(200).json(result);
  }),

  appleLogin: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.oauthLogin('APPLE', req.body);
    res.status(200).json(result);
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refresh(req.body.refreshToken);
    res.status(200).json(result);
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) throw AppError.badRequest('refreshToken is required');
    await authService.logout(refreshToken);
    res.status(204).send();
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw AppError.unauthorized();
    res.status(200).json({ id: req.user.id, role: req.user.role });
  }),
};
