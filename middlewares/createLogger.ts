import crypto from 'node:crypto';
import type { Response, NextFunction } from 'express';
import { createLogger as createInstance } from '../modules/logger';
import type { ExtendedRequest } from '../interfaces';

const createLogger = (logDir: string) => {
  const logger = createInstance(logDir);

  return (req: ExtendedRequest & Request, res: Response, next: NextFunction) => {
    req.log = logger.child({ 
      requestId: crypto.randomUUID(),
      method: req.method,
      url: req.url
    });

    next();
  };
};

export { createLogger };
