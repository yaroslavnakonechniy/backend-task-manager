import { Router } from 'express';
import { body } from 'express-validator';

import { authVerification } from '../../../middlewares';
import { AuthRepository } from '../../../repositories/mongo-db';
import { AuthService } from '../../../services';
import { AuthController } from '../controllers/auth';

export const createAuthRouter = (): Router => {
  const router = Router();

  const repository = new AuthRepository();
  const service = new AuthService({ repository });
  const controller = new AuthController({ authService: service });

  // Protected route to get current user data
  router.get('/me', authVerification, controller.getMe.bind(controller));

  router.post(
    '/sign-up',
    [
      body('name')
        .notEmpty()
        .withMessage('Name is required')
        .trim(),
      body('email')
        .notEmpty()
        .withMessage('Email is required')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address'),
      body('password')
        .notEmpty()
        .withMessage('Password is required')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
    ],
    controller.signUp.bind(controller)
  );

  router.post(
    '/sign-in',
    [
      body('email')
        .notEmpty()
        .withMessage('Email is required')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address'),
      body('password')
        .notEmpty()
        .withMessage('Password is required')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
    ],
    controller.signIn.bind(controller)
  );

  router.post('/sign-out', controller.signOut.bind(controller));

  return router;
};
