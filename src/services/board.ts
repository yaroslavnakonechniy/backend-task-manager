import crypto from "node:crypto";
import { validationResult } from "express-validator";
import { transformWorkflow } from "../utils";
import { ForbiddenError, NotFoundError, ValidationError } from "../common/errors";

import type { IExtendedRequest, IRepository, ITask, WorkflowCode } from "../interfaces";
import type { IBoard, BoardDataUpdate, BoardDataCreate } from "../interfaces/entities/board";

type ConstructorParams = {
  boardRepository: IRepository;
  taskRepository: IRepository;
};
export class BoardService {
  private boardRepository: IRepository;
  private taskRepository: IRepository;

  constructor({ boardRepository, taskRepository }: ConstructorParams) {
    this.boardRepository = boardRepository;
    this.taskRepository = taskRepository;
  }

  public async getBoardTasks(request: IExtendedRequest) {
    const { boardId } = request.params!;

    const board = await this.boardRepository.findById<IBoard>(boardId as string);

    if (board && board.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to access this board');
    }

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    const tasks = await this.taskRepository.findByQuery<ITask>({
      authorId: request.user!.id,
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
    const boards = await this.boardRepository.findByQuery<IBoard>({ authorId: request.user!.id });

    if (!boards.length) {
      throw new NotFoundError('No boards found');
    }
  
    return boards;
  }

  public async getBoardById(
    request: IExtendedRequest,
    { id }: { id: string }
  ) {
    const board = await this.boardRepository.findById<IBoard>(id);

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
    { boardData }: { boardData: BoardDataCreate }
  ) {
    const result = validationResult(request);
    
    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array());
    }

    const payload = {
      ...boardData,
      id: crypto.randomUUID(),
      authorId: request.user!.id,
    };

    const newBoard = await this.boardRepository.create<IBoard, BoardDataCreate>(payload);

    return newBoard;
  }

  public async updateBoard(
    request: IExtendedRequest,
    { id, boardData }: { id: string, boardData: BoardDataUpdate }
  ) {
    const board = await this.boardRepository.findById<IBoard>(id);

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

    const updatedBoard = await this.boardRepository.update<BoardDataUpdate, BoardDataUpdate>(id, boardData);

    if (!updatedBoard) {
      throw new NotFoundError('Board not found');
    }

    return updatedBoard;
  }

  public async deleteBoard(request: IExtendedRequest, { id }: { id: string }) {
    const board = await this.boardRepository.findById<IBoard>(id);

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    if (board && board.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to delete this board');
    }

    return this.boardRepository.delete(id);
  }

  public async streamBoardTasks(request: IExtendedRequest, callback: (task: ITask) => void) {
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
  }
}
