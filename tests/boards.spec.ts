import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import { createApp } from "../src/app";
import { loggerInstance } from "./mocks/logger";
import type { ApiResponse, IBoard, ITask } from "../src/interfaces";

describe('Boards & Tasks Routes', () => {
  const app = createApp({ loggerInstance });
  const alexBoardId = 'd60275d0-b457-4531-85f9-8a98316b3433';

  it('GET /api/v1/boards should return all Alex boards', async () => {
    
    const { status, body } = await request(app)
      .get('/api/v1/boards')
      .set('Cookie', authCookies);

    const { data } = body as { data: IBoard[] };

    expect(status).toBe(200);
    expect(data.length).toBe(2);
  });

  it('POST /api/v1/boards should create a new board', async () => {
    const newBoard = {
      name: 'New Board',
      description: 'Description for new board',
    };

    const { status, body } = await request(app)
      .post('/api/v1/boards')
      .set('Cookie', authCookies)
      .send(newBoard);

    const { data } = body as ApiResponse<IBoard>;

    expect(status).toBe(201);
    expect(data!.name).toBe(newBoard.name);
    expect(data!.description).toBe(newBoard.description);
  });

  it('GET /api/v1/boards should create a new board and return error', async () => {
    const newBoard = {};

    const { status, body, clientError } = await request(app)
      .post('/api/v1/boards')
      .set('Cookie', authCookies)
      .send(newBoard);

    const { error } = body as ApiResponse<IBoard>;

    expect(status).toBe(400);
    expect(clientError).toBe(true);

    expect(error!.message).toBe('Validation failed');
    expect(error!.code).toBe('VALIDATION_ERROR');

    expect(error!.details).toBeDefined();
    expect(Array.isArray(error!.details)).toBe(true);
    expect(error!.details!.length).toBeGreaterThan(0);
    expect(error!.details).toEqual(expect.arrayContaining([
      expect.objectContaining({ field: 'name', message: 'Name is required' }),
      expect.objectContaining({ field: 'description', message: 'Description is required' }),
    ]));
  });

  it('GET /api/v1/boards/:id/tasks should return 10 tasks for Alex board #1', async () => {
    const { status, body } = await request(app)
      .get(`/api/v1/boards/${alexBoardId}/tasks`)
      .set('Cookie', authCookies);

    const { data } = body as ApiResponse<ITask[]>;

    expect(status).toBe(200);
    expect(data!.length).toBe(10);
    expect(data![0]!.boardId).toBe(alexBoardId);
  });
});
