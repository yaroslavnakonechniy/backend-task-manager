import request from 'supertest';
import { config } from 'dotenv';
import { beforeAll, afterAll } from '@jest/globals';
import { connect, closeDB, BoardRepository, AuthRepository, TaskRepository, cleanDB } from '../src/repositories/mongoose';
import { createApp } from '../src/app';
import { loggerInstance } from './mocks/logger';

import INITIAL_DATA from '../src/migrations/initial-data/db.json';

declare global {
  var authCookies: string[];
}

config({ path: '.env.test' });

beforeAll(async () => {
  try {
    const { DB_URI, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

    await connect({
      uri: DB_URI || '',
      user: DB_USER || '',
      password: DB_PASSWORD || '',
      name: DB_NAME || '',
    });

    const authRepository = new AuthRepository();
    const boardRepository = new BoardRepository();
    const taskRepository = new TaskRepository();

    await cleanDB();
    await boardRepository.createMany(INITIAL_DATA.boards);
    await authRepository.createMany(INITIAL_DATA.users);
    await taskRepository.createMany(INITIAL_DATA.tasks);

    const loginRes = await request(createApp({ loggerInstance }))
      .post('/api/v1/auth/sign-in')
      .send({ 
        email: 'alex@gmail.com', 
        password: 'alex-12345'
      });

    global.authCookies = loginRes.get('Set-Cookie') || [];

  } catch (error) {
    console.error('Error in beforeAll setup:', error);
    process.exit(1); // Exit with failure code
  }
});

afterAll(async () => {
  await closeDB();
});
