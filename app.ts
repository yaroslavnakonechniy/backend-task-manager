import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'node:path';
import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import session from 'express-session';
import passport from 'passport';
import { router as apiV1 } from './api/v1/routes';
import { logger, currentUser } from './middlewares';
import { BaseError, NotFoundError } from './common/errors';

import { ErrorCodes, StatusCodes, type IApp, type IExtendedRequest } from './interfaces';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createApp = ({ loggerInstance }: IApp): Application => {
  const staticPath = path.join(__dirname, '..' ,'public');

  const app = express();

  app.use('/static', express.static(staticPath));
  app.use(express.json());

  app.use(
    session({
      secret: 'super-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false
      }
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(logger(loggerInstance));
  app.use(currentUser);

  app.get('/', (req: IExtendedRequest, res: Response) => {
    res.status(200).json({ message: 'Welcome to the Tasks Manager API' });
  });
  app.use('/api/v1', apiV1);

  app.use((req: IExtendedRequest & Request, res: Response, next: NextFunction) => {
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
