export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export type UserDataUpdate = Partial<Omit<IUser, 'id'>>;
export type UserDataReturn = Omit<IUser, 'password'> & { token?: string };
