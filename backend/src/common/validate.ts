import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from './AppError';

interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        return next(AppError.badRequest('Invalid request body', result.error.flatten()));
      }
      req.body = result.data;
    }
    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        return next(AppError.badRequest('Invalid query parameters', result.error.flatten()));
      }
      req.query = result.data as never;
    }
    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        return next(AppError.badRequest('Invalid path parameters', result.error.flatten()));
      }
      req.params = result.data as never;
    }
    next();
  };
};
