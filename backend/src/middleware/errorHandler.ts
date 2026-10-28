import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../common/AppError';
import { logger } from '../config/logger';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: `Route ${req.originalUrl} not found` } });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err }, err.message);
    }
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: { code: 'BAD_REQUEST', message: 'Validation failed', details: err.flatten() },
    });
  }

  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
  });
};
