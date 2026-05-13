import type { NextFunction, Response } from 'express';
import { AuthService } from "../../../services";

import { StatusCodes, type IExtendedRequest } from '../../../interfaces';

type ConstructorParams = {
  authService: AuthService;
};

export class AuthController {
  private authService: AuthService;

  constructor({ authService }: ConstructorParams) {
    this.authService = authService;
  }

  public async getMe(req: IExtendedRequest, res: Response, next: NextFunction) {
    return this.authService
      .getMe(req)
      .then(user => {
        res.status(StatusCodes.SUCCESS).json({ data: user });
      })
      .catch(error => {
        req?.log?.error(`Failed to fetch user data`, { error });

        next(error);
      });
  }

  async signUp(req: IExtendedRequest, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;

    this.authService
      .signUp(req, { name, email, password })
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

  async signIn(req: IExtendedRequest, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    this.authService
      .signIn(req, { email, password })
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
    req.session = null;

    res.status(StatusCodes.SUCCESS).json({
      data: {},
      error: {}
    });
  }
}
