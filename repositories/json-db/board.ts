import { JsonServerRepository } from './base';

export class BoardRepository extends JsonServerRepository {
  constructor() {
    super('boards');
  }
}
