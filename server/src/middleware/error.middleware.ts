import { Request, Response, NextFunction } from 'express';
import { AppError } from './app-error';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isAppError = err instanceof AppError;
  
  const status = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : 'INTERNAL_ERROR';
  const message = (err as Error)?.message || 'An unexpected error occurred';

  res.status(status).json({
    error: { message, code }
  });
};