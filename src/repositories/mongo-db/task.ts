import { MongoDbRepository } from './base';

export class TaskRepository extends MongoDbRepository {
  constructor() {
    super('tasks');
  }

  public async updateTaskWorkflow<T, R>(id: string, data: T): Promise<R> {
    const collection = this.db.collection(this.resource);

    await collection.updateOne({ id }, { $set: data as any });

    return collection.findOne({ id }) as Promise<R>;
  }
}
