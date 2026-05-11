import { type Request, type Response, type NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { UnauthorizedError } from '../common/errors';

import type { IUser } from '../interfaces';

export const authVerification = (req: Request, res: Response, next: NextFunction) => {
  const token = req.session?.jwt;

  if (!token) {
    return next(new UnauthorizedError('No authentication token provided'));
  }

  try {
    const payload = jwt.verify(
      token, 
      process.env.JWT_SECRET_KEY!
    ) as { user: Pick<IUser, 'id'> };

    req.user = payload.user;
  }
  catch {
    return next(new UnauthorizedError('Invalid authentication token'));
  }

  next();
};
