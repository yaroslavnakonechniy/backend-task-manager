import { MongooseRepository } from './base';
import { Task } from '../../models';
import { ITask } from '../../interfaces';

export class TaskRepository extends MongooseRepository<ITask> {
  constructor() {
    super(Task);
  }

  public async updateTaskWorkflow(id: string, data: Pick<ITask, 'workflow'>): Promise<ITask> {
    const task = await this.model
      .findOneAndUpdate({ id }, data, { returnDocument: 'after' })
      .lean();

    return task as ITask;
  }
}
