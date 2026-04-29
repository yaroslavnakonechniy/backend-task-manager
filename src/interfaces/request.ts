import type { Request } from 'express';
import type { Logger } from 'winston';
import type { IUser } from './entities/user';

export interface IExtendedRequest extends Request {
  log?: Logger;
  user?: any & Pick<IUser , 'id'>;
}
