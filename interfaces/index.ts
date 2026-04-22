import type { Request } from 'express';
import type { Logger } from 'winston';

export interface User {
  id: string;
}

export interface ExtendedRequest extends Request {
  log?: Logger;
  user?: User;
}
