import { MongoDbRepository } from './base';

export class AuthRepository extends MongoDbRepository {
  constructor() {
    super('users');
  }
}
