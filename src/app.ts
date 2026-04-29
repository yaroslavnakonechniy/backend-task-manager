import path from 'node:path';
import express, { type Application, type Response, type NextFunction } from 'express';
import session from 'cookie-session';

import { router as apiV1 } from './api/v1/routes/index.js'; // Не забувайте .js
import { logger } from './middlewares/index.js';
import { BaseError, NotFoundError } from './common/errors/index.js';
import { ErrorCodes, StatusCodes, type IApp, type IExtendedRequest } from './interfaces/index.js';

// ПРАВИЛЬНО ініціалізуємо __dirname для ESM
export const createApp = ({ loggerInstance }: IApp): Application => {
  const staticPath = path.join(__dirname, '..', 'public');
  const app = express();

  app.use('/static', express.static(staticPath));
  app.use(express.json());

  app.use(session({
    name: 'session',
    keys: [process.env.COOKIE_SECRET_KEY || 'default-secret-key'], 
    maxAge: 24 * 60 * 60 * 1000, 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  }));

  app.use(logger(loggerInstance));

  app.get('/', (req: IExtendedRequest, res: Response) => {
    res.status(200).json({ message: 'Welcome to the Tasks Manager API' });
  });

  app.use('/api/v1', apiV1);

  app.use((req: IExtendedRequest, res: Response, next: NextFunction) => {
    next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
  });

  // Оновлений обробник помилок
  app.use((error: any, req: IExtendedRequest, res: Response, next: NextFunction) => {
    // Дістаємо message НАПРЯМУ, без деструктуризації
    const errorMessage = error.message || 'Something went wrong';
    
    // Обов'язково виводимо в консоль сервера, щоб бачити реальну помилку під час розробки
    console.error(' [SERVER ERROR] ', error);

    req.log?.error(errorMessage, { 
      stack: error.stack,
      ...error // копіюємо інші властивості, якщо вони є
    });

    if (error instanceof BaseError) {
      return res.status(error.statusCode).json({
        data: {},
        error: error.serialize() // Ваш метод serialize вже має повертати message та code
      });
    }

    // Для всіх інших типів помилок (системних, помилок бібліотек тощо)
    res.status(StatusCodes?.COMMON_ERROR || 500).json({
      data: {},
      error: { 
        code: ErrorCodes?.COMMON_ERROR || 'COMMON_ERROR',
        message: errorMessage
      }
    });
  });

  return app;
};
