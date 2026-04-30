import path from 'path';
import dotenv from 'dotenv';
import { TaskRepository, connect, getClient } from "../repositories/mongo-db";
import type { ITask } from '../interfaces';

import INITIAL_DATA from './initial-data/db.json';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const { DB_URI, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

connect({
  uri: DB_URI || '',
  user: DB_USER || '',
  password: DB_PASSWORD || '',
  name: DB_NAME || '',
})
  .then((client) => {
    console.log('Connected to MongoDB database');

    const repositories = new TaskRepository();

    return repositories.createMany<ITask, ITask>(INITIAL_DATA.tasks as ITask[]);
  })
  .then((result) => {
    console.log('Tasks', result);
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB database', { error });

    throw new Error('Failed to connect to MongoDB database');
  })
  .finally(() => {
    console.log('Migration finished');
    const client = getClient();

    if (client) {
      client.close();
    }
  });
