import { MongoDbRepository } from './base';

export class BoardRepository extends MongoDbRepository {
  constructor() {
    super('boards');
  }
}
