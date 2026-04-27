import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { IRepository } from '../../interfaces/repository';

let client: AxiosInstance | null = null;
export abstract class JsonServerRepository implements IRepository {
  protected readonly resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }

  private get db() {
    const client = getClient();

    if (!client) {
      throw new Error('Client not initialized. Please call connect() first.');
    }

    return client;
  }

  public async findAll<T>(): Promise<T[]> {
    return this.db.get(`/${this.resource}`)
      .then((response: AxiosResponse<T[]>) => response.data);
  }

  public async findById<T>(id: string): Promise<T> {
    return this.db.get(`/${this.resource}/${id}`)
      .then((response: AxiosResponse<T>) => response.data);
  }

  public async findByQuery<T>(query: Record<string, string>): Promise<T> {
    const queryString = Object.entries(query)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    return this.db.get(`/${this.resource}?${queryString}`)
      .then((response: AxiosResponse<T>) => response.data);
  }

  public async create<T, R>(data: T): Promise<R> {
    return this.db.post(`/${this.resource}`, data)
      .then((response: AxiosResponse<R>) => response.data);
  }

  public async update<T, R>(id: string, data: T): Promise<R> {
    return this.db.put(`/${this.resource}/${id}`, data)
      .then((response: AxiosResponse<R>) => response.data);
  }

  public async delete(id: string): Promise<void> {
    return this.db.delete(`/${this.resource}/${id}`);
  }
}

export const connect = async (baseURL: string): Promise<AxiosInstance> => {
  client = axios.create({ baseURL });

  return Promise.resolve(client);
};

export const getClient = (): AxiosInstance => {
  if (!client) {
    throw new Error('Client not initialized. Please call connect() first.');
  }

  return client;
}
