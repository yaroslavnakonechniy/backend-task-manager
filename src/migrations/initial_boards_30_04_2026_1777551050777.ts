import path from 'path';
import dotenv from 'dotenv';
import { BoardRepository, connect, getClient } from "../repositories/mongo-db";
import type { IBoard } from '../interfaces';

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

    const repositories = new BoardRepository();

    return repositories.createMany<IBoard, IBoard>(INITIAL_DATA.boards as IBoard[]);
  })
  .then((result) => {
    console.log('Boards', result);
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
