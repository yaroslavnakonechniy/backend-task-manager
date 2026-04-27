export interface IRepository {
  findAll<T>(): Promise<T[]>;
  findByQuery<T>(query: Record<string, string>): Promise<T[]>;
  findById<T>(id: string): Promise<T>;
  create<T, R>(data: T): Promise<R>;
  update<T, R>(id: string, data: T): Promise<R>;
  delete(id: string): Promise<void>;
}
