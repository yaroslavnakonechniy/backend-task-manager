import { type Request, type Response, type NextFunction } from 'express';
import type { ExtendedRequest } from '../interfaces';

export const logTimestamp = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  console.log('Timestamp:', Date.now());

  next();
};
