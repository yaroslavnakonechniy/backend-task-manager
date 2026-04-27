import { JsonServerRepository } from './base';

export class TaskRepository extends JsonServerRepository {
  constructor() {
    super('tasks');
  }
}
