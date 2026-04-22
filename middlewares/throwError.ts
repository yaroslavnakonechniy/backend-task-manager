import { type Request, type Response, type NextFunction } from 'express';
import type { ExtendedRequest } from '../interfaces';

export const throwError = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  if (Math.random() < 0.5) {
    return next(new Error('Random error'));
  }

  next();
};
