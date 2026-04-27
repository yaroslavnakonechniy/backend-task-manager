import { type Response, type NextFunction } from 'express';
import type { IExtendedRequest } from '../interfaces';

export const currentUser = (req: IExtendedRequest, res: Response, next: NextFunction) => {
  const user = {
    id: '37d42238-a84d-47c4-8030-e3d0e91d43de'
  };

  req.user = user;

  next();
};

