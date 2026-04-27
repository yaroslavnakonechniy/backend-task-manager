import { AuthService } from "../../../services";

import { StatusCodes, type IExtendedRequest } from '../../../interfaces';
import type { NextFunction, Request, Response } from 'express';

type ConstructorParams = {
  authService: AuthService;
};

export class AuthController {
  private authService: AuthService;

  constructor({ authService }: ConstructorParams) {
    this.authService = authService;
  }

  async signUp(req: IExtendedRequest & Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;

    this.authService
      .createUser(req, { name, email, password })
      .then(user => {
        return res
          .status(StatusCodes.CREATED)
          .json({
            data: user,
            error: {}
          });
      })
      .catch(error => {
        req?.log?.error(`Failed to create user`, { error });

        next(error);
      });
  }

  async signIn(req: IExtendedRequest & Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    this.authService
      .getUser(req, { email, password })
      .then(user => {
        res.status(StatusCodes.SUCCESS).json({
          data: user,
          error: {}
        });
      })
      .catch(error => {
        req?.log?.error(`Failed to sign in user with email ${email}`, { error });

        next(error);
      });
  }

  async signOut(req: IExtendedRequest, res: Response) {
    // Implement sign out logic if needed (e.g., invalidate tokens, clear cookies)
    res.status(200).json({ message: 'Sign out successful' });
  }
}
