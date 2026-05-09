import crypto from "node:crypto";
import { validationResult } from "express-validator";
import { transformWorkflow } from "../utils";
import { ForbiddenError, NotFoundError, ValidationError } from "../common/errors";

import type { IExtendedRequest, IRepository, ITaskRepository, WorkflowCode } from "../interfaces";
import type { IBoard, ITask } from "../interfaces/entities";
import { IBoardRepository } from '../interfaces';

type ConstructorParams = {
  boardRepository: IBoardRepository;
  taskRepository: ITaskRepository;
};
export class BoardService {
  private boardRepository: IBoardRepository;
  private taskRepository: ITaskRepository;

  constructor({ boardRepository, taskRepository }: ConstructorParams) {
    this.boardRepository = boardRepository;
    this.taskRepository = taskRepository;
  }

  // api/v1/boards/:boardId/tasks
  public async getBoardTasks(request: IExtendedRequest) {
    const { boardId } = request.params!;

    const board = await this.boardRepository.findById(boardId as string);

    if (board && board.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to access this board');
    }

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    const tasks = await this.taskRepository.findByQuery({
      authorId: request.user!.id as string,
      boardId: boardId as string
    });

    if (!tasks.length) {
      throw new NotFoundError('No tasks found');
    }

    return tasks.map(task => ({
      ...task,
      workflow: transformWorkflow(task.workflow as WorkflowCode),
    }));
  }

  public async getAllBoards(request: IExtendedRequest) {
    const boards = await this.boardRepository.findByQuery({ authorId: request.user!.id });

    if (!boards.length) {
      throw new NotFoundError('No boards found');
    }
  
    return boards;
  }

  public async getBoardById(
    request: IExtendedRequest,
    { id }: { id: string }
  ) {
    const board = await this.boardRepository.findById(id);

    if (board && board.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to access this board');
    }

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    return board;
  }

  public async createBoard(
    request: IExtendedRequest,
    { boardData }: { boardData: IBoard }
  ) {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array());
    }

    const payload = {
      ...boardData,
      id: crypto.randomUUID(),
      authorId: request.user!.id as string,
    };

    const newBoard = await this.boardRepository.create(payload);

    return newBoard;
  }

  public async updateBoard(
    request: IExtendedRequest,
    { id, boardData }: { id: string, boardData: IBoard }
  ) {
    const board = await this.boardRepository.findById(id);

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    if (board && board.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to update this board');
    }

    const result = validationResult(request);

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array());
    }

    const updatedBoard = await this.boardRepository.update(id, boardData);

    if (!updatedBoard) {
      throw new NotFoundError('Board not found');
    }

    return updatedBoard;
  }

 /*  public async streamBoardTasks(request: IExtendedRequest, callback: (task: ITask) => void) {
    const { boardId } = request.params!;

    const board = await this.boardRepository.findById<IBoard>(boardId as string);

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    if (board.authorId !== request.user!.id) {
      throw new ForbiddenError('No access');
    }

    if (!this.taskRepository.findCursor) {
      throw new Error('Cursor not supported');
    }


    await this.taskRepository.findCursor<ITask>(
      {
        authorId: request.user!.id,
        boardId: boardId,
      },
      async (task) => {
        console.log('Processing:', task.id);

        //await new Promise(r => setTimeout(r, 500)); // затримка, для перевірки роботи курсора

        callback({
          ...task,
          workflow: transformWorkflow(task.workflow as WorkflowCode) as any,
        });
      }
    );
  } */

  public async streamBoardTasks(
    request: IExtendedRequest,
    callback: (task: ITask) => void
  ) {

    const { boardId } = request.params!;

    if (!boardId || Array.isArray(boardId)) {
      throw new Error('Invalid boardId');
    }

    const board = await this.boardRepository.findById(boardId);

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    if (board.authorId !== request.user!.id) {
      throw new ForbiddenError('No access');
    }

    await this.taskRepository.findCursor(
      {
        authorId: request.user!.id,
        boardId,
      },
      async (task: ITask) => {
        callback({
          ...(task as ITask),
          workflow: task.workflow,
        });
      }
    );
  }

  public async getBoardsStatistics(request: IExtendedRequest) {
  
    const userId = request.user!.id;

    const stats = await this.boardRepository.getBoardsStatistics(userId);

    if (!stats) {
      throw new NotFoundError('Statistics not found');
    }

    return stats;
  }

  public async deleteBoard(request: IExtendedRequest, { id }: { id: string }) {
    const board = await this.boardRepository.findById(id);

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    if (board && board.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to delete this board');
    }

    return this.boardRepository.delete(id);
  }
}
