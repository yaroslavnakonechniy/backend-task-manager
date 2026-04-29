import type { IRepository } from '../../interfaces/repository';

export abstract class MongoDbRepository implements IRepository {
  constructor() {}

  public async findAll<T>(): Promise<T[]> {throw new Error("Method not implemented.");}

  public async findById<T>(id: string): Promise<T> {throw new Error("Method not implemented.");}

  public async findByQuery<T>(query: Record<string, string>): Promise<T> {throw new Error("Method not implemented.");}

  public async create<T, R>(data: T): Promise<R> {throw new Error("Method not implemented.");}

  public async update<T, R>(id: string, data: T): Promise<R> {throw new Error("Method not implemented.");}

  public async delete(id: string): Promise<void> {throw new Error("Method not implemented.");}
}

export const connect = async (): Promise<any> => {};
