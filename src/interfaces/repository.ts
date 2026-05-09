import { ITask, IBoard } from "./entities";

export interface IRepository<M extends { id: string; } = any> {
  findAll(): Promise<M[]>;
  findByQuery(query: Partial<M>): Promise<M[]>;
  findById(id: string): Promise<M | null>;
  create(data: M): Promise<M>;
  createMany(data: M[]): Promise<M[]>;
  update(id: string, data: Partial<M>): Promise<M>;
  delete(id: string): Promise<void>;
  findCursor<T>(query: Record<string, unknown>,callback: (doc: T) => Promise<void> | void): Promise<void>;
}

export interface ITaskRepository extends IRepository<ITask> {
  updateTaskWorkflow(id: string, data: Pick<ITask, 'workflow'>): Promise<ITask>;
}

export interface IBoardRepository extends IRepository<IBoard> {
  getBoardsStatistics(userId: string): Promise<any>;
}

export type ConstructorParams<R extends IRepository = IRepository> = {
  repository: R;
};

