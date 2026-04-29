import { JsonServerRepository } from './base';
import type { AxiosResponse } from 'axios';

export class TaskRepository extends JsonServerRepository {
  constructor() {
    super('tasks');
  }

  public async updateTaskWorkflow<T, R>(id: string, data: T): Promise<R> {
    return this.db.patch(`/${this.resource}/${id}`, data)
      .then((response: AxiosResponse<R>) => response.data);
  }
}
