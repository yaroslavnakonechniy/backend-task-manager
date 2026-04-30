import { MongoClient, type Db } from 'mongodb';

import type { IRepository } from '../../interfaces/repository';

type MongoDbOptions = {
  uri: string;
  user: string;
  password: string;
  name: string;
};

let client: MongoClient | null = null;
let db: Db | null = null;

export abstract class MongoDbRepository implements IRepository {
  protected readonly resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }

  protected get db() {
    const client = getDB();

    if (!client) {
      throw new Error('Client not initialized. Please call connect() first.');
    }

    return client;
  }

  public async findAll<T>(): Promise<T[]> {
    const collection = this.db.collection(this.resource);

    return collection.find().toArray() as Promise<T[]>;
  }

  public async findById<T>(id: string): Promise<T> {
    const collection = this.db.collection(this.resource);

    return collection.findOne({ id }) as Promise<T>;
  }

  public async findByQuery<T>(query: Record<string, string>): Promise<T[]> {
    const collection = this.db.collection(this.resource);

    return collection.find(query, { projection: { _id: 0 } }).toArray() as Promise<T[]>;
  }

  public async create<T, R>(data: T): Promise<R> {
    const collection = this.db.collection(this.resource);

    const result = await collection.insertOne(data as any);

    return collection.findOne({ _id: result.insertedId }) as Promise<R>;
  }

  public async createMany<T, R>(data: T[]): Promise<R[]> {
    const collection = this.db.collection(this.resource);

    const result = await collection.insertMany(data as any);

    return [];
  }

  public async update<T, R>(id: string, data: T): Promise<R> {
    const collection = this.db.collection(this.resource);

    await collection.updateOne({ id }, { $set: data as any });

    return collection.findOne({ id }) as Promise<R>;
  }

  public async delete(id: string): Promise<any> {
    const collection = this.db.collection(this.resource);

    return collection.deleteOne({ id });
  }
}

export const connect = async (options: MongoDbOptions): Promise<MongoClient> => {
  const uri = options.uri
    .replace('{{user}}', encodeURIComponent(options.user))
    .replace('{{password}}', encodeURIComponent(options.password));

  const mongoClient = new MongoClient(uri);
  const clientConnection = await mongoClient.connect();

  db = clientConnection.db(options.name);
  client = clientConnection;

  return Promise.resolve(client);
};

export const getClient = (): MongoClient => {
  if (!client) {
    throw new Error('Client not initialized. Please call connect() first.');
  }

  return client;
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error('Database not initialized. Please call connect() first.');
  }

  return db;
};
