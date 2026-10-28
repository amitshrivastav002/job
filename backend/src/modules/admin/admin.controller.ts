import type { Request, Response } from 'express';
import { asyncHandler } from '../../common/asyncHandler';
import { adminService } from './admin.service';

export const adminController = {
  listUsers: asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    res.status(200).json(await adminService.listUsers(page, pageSize));
  }),

  listJobs: asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    res.status(200).json(await adminService.listJobs(page, pageSize));
  }),

  listCompanies: asyncHandler(async (req: Request, res: Response) => {
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    res.status(200).json(await adminService.listCompanies(page, pageSize));
  }),

  getSettings: asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json(adminService.getSettings());
  }),

  setUserActive: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(await adminService.setUserActive(req.params.id, req.body.isActive));
  }),

  verifyCompany: asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(await adminService.verifyCompany(req.params.id));
  }),
};
