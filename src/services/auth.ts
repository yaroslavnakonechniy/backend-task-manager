import crypto from "node:crypto";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { Password } from "../modules/Password";
import { InvalidCredentialsError, NotFoundError, ValidationError } from "../common/errors";

import type { IExtendedRequest, IRepository, IUser, UserDataReturn } from "../interfaces";

type ConstructorParams = {
  repository: IRepository;
};

export class AuthService {
  private readonly repository: IRepository;

  constructor({ repository }: ConstructorParams) {
    this.repository = repository;
  }

  public async signUp(request: IExtendedRequest, { name, email, password }: Pick<IUser, 'name' | 'email' | 'password'>): Promise<UserDataReturn> {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array());
    }

    const [existingUser] = await this.repository.findByQuery<UserDataReturn>({ email });

    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    const hashedPassword = await Password.hash(password);

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    const createdUser = await this.repository.create<IUser, IUser>(newUser);

    const token = jwt.sign(
      { user: { id: newUser.id } },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '1h' }
    );

    request.session = {
      jwt: token,
    };

    const { password: _, ...userData } = createdUser;

    return {
      ...userData,
      token,
    };
  }

  public async signIn(request: IExtendedRequest, { email, password }: Pick<IUser, 'email' | 'password'>): Promise<UserDataReturn> {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array());
    }

    const [existingUser] = await this.repository.findByQuery<IUser>({ email })

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    const verificationResult = await Password.verify(existingUser.password, password);

    if (!verificationResult) {
      throw new InvalidCredentialsError('Invalid credentials');
    }

    const token = jwt.sign(
      { user: { id: existingUser.id } },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '1h' }
    );
    
    request.session = {
      jwt: token,
    };

    const { password: _ , ...userData } = existingUser;
    
    return {
      ...userData,
      token,
    };
  }

  public async validateUser(email: string, password: string): Promise<Pick<IUser, 'id'> | null> {
    const [user] = await this.repository.findByQuery<IUser>({ email });

    if (user && await Password.verify(user.password, password)) {
      return { id: user.id }; // Повертаємо лише те, що потрібно для Passport
    }
    return null;
  }
}
