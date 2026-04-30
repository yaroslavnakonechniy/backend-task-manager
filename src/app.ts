import path from 'node:path';
import express, { type Application, type Response, type NextFunction } from 'express';
import session from 'cookie-session';
import cors from 'cors';
import helmet from 'helmet';

import { router as apiV1 } from './api/v1/routes';
import { logger } from './middlewares';
import { BaseError, NotFoundError } from './common/errors';

import { ErrorCodes, StatusCodes, type IApp, type IExtendedRequest } from './interfaces';

export const createApp = ({ loggerInstance }: IApp): Application => {
  const staticPath = path.join(__dirname, '..' ,'public');

  const app = express();

  const clientUrls = process.env!.CLIENT_URLS!.split(/\s*,\s*/);
  const corsOptions = {
    origin: clientUrls,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.use(helmet());
  app.use('/static', express.static(staticPath));
  app.use(express.json());
  app.use(session({
      name: 'session',
      keys: [process.env.COOKIE_SECRET_KEY!],
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
  }));
  app.use(logger(loggerInstance));

  app.get('/', (req: IExtendedRequest, res: Response) => {
    res.status(200).json({ message: 'Welcome to the Tasks Manager API' });
  });
  app.use('/api/v1', apiV1);

  app.use((req: IExtendedRequest, res: Response, next: NextFunction) => {
    next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
  });

  app.use((error: Error, req: IExtendedRequest, res: Response, next: NextFunction) => {
    const {
      message = 'Something went wrong',
      ...restArgs
    } = error;

    req.log?.error(`${message}`, restArgs);

    if (error instanceof BaseError) {
      res.status(error.statusCode).json({
        data: {},
        error: error.serialize(),
      });
    
      return;
    }

    res.status(StatusCodes.COMMON_ERROR).json({
      data: {},
      error: { 
        code: ErrorCodes.COMMON_ERROR,
        message
      }
    });
  });

  return app;
};
