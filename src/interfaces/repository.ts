export interface IRepository {
  findAll<T>(): Promise<T[]>;
  findByQuery<T>(query: Record<string, string>): Promise<T[]>;
  findById<T>(id: string): Promise<T>;
  create<T, R>(data: T): Promise<R>;
  createMany<T, R>(data: T[]): Promise<R[]>;
  update<T, R>(id: string, data: T): Promise<R>;
  delete(id: string): Promise<void>;
  findCursor?<T>(query: Record<string, unknown>,callback: (doc: T) => Promise<void> | void): Promise<void>;
}

export interface ITaskRepository extends IRepository {
  updateTaskWorkflow<T extends Record<string, unknown>, R>(id: string, data: T): Promise<R>;
}

export type ConstructorParams<R extends IRepository = IRepository> = {
  repository: R;
};
