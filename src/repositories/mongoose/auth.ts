import { MongooseRepository } from './base';
import { User } from '../../models';
import { IUser } from '../../interfaces';

export class AuthRepository extends MongooseRepository<IUser> {
  constructor() {
    super(User);
  }
}
