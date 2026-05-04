import crypto from "crypto";
import { validationResult } from "express-validator";
import { transformWorkflow } from "../utils";
import { ForbiddenError, NotFoundError, ValidationError } from "../common/errors";

import { type IBoard, type IExtendedRequest, type IRepository, ITaskRepository, WorkflowCode } from "../interfaces";
import type { ITask, TaskDataUpdate } from "../interfaces/entities/task";

type ConstructorParams = {
  boardRepository: IRepository;
  taskRepository: ITaskRepository;
};

export class TaskService {
  private boardRepository: IRepository;
  private taskRepository: ITaskRepository;

  constructor({ boardRepository, taskRepository }: ConstructorParams) {
    this.boardRepository = boardRepository;
    this.taskRepository = taskRepository;
  }

  // api/v1/tasks?boardId=:boardId
  /* public async getAllTasks(request: IExtendedRequest) {
    const { boardId = '' } = request.query!;

    const result = validationResult(request);

    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array());
    }
    
    const board = await this.boardRepository.findById<IBoard>(boardId as string);

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    if (board && board.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to access this board');
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
  } */

  public async streamTasks(request: IExtendedRequest, callback: (task: ITask) => void, boardId: string) {
    if (!this.taskRepository.findCursor) {
      throw new Error('Cursor not supported');
    }

    await this.taskRepository.findCursor<ITask>(
      { 
        authorId: request.user!.id,
        boardId: boardId // Фільтруємо за конкретною дошкою
      },
      async (task) => {
        callback({
          ...task,
          workflow: transformWorkflow(task.workflow as WorkflowCode) as any,
        });
      }
    );
  }

  public async getTaskById(req: IExtendedRequest, { id }: { id: string }) {
    const task = await this.taskRepository.findById<ITask>(id);
  
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    if (task.authorId !== req.user!.id) {
      throw new ForbiddenError('You do not have permission to access this task');
    }
  
    return {
      ...task,
      workflow: transformWorkflow(task.workflow as WorkflowCode),
    };
  }

  public async createTask(request: IExtendedRequest, { taskData }: { taskData: ITask }) {
    const result = validationResult(request);
    
    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array());
    }

    const payload = {
      ...taskData,
      description: taskData.description || '',
      workflow: taskData.workflow || WorkflowCode.TODO,
      id: crypto.randomUUID(),
      authorId: request.user!.id,
    };

    return this.taskRepository.create<ITask, ITask>(payload);
  }

  public async updateTask(
    request: IExtendedRequest,
    { id, taskData }: { id: string, taskData: TaskDataUpdate }
  ) {
    const result = validationResult(request);
    
    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array());
    }

    const task = await this.taskRepository.findById<ITask>(id);

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    if (task.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to update this task');
    }

    const updatedTask = await this.taskRepository.update<TaskDataUpdate, ITask>(id, taskData);
  
    return {
      ...updatedTask,
      workflow: transformWorkflow(updatedTask.workflow as WorkflowCode),
    };
  }

  public async updateTaskWorkflow(
    request: IExtendedRequest,
    { id, taskData }: { id: string, taskData: TaskDataUpdate }
  ) {
    const result = validationResult(request);
    
    if (!result.isEmpty()) {
      throw new ValidationError('Validation failed', result.array());
    }

    const task = await this.taskRepository.findById<ITask>(id);

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    if (task.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to update this task');
    }

    const updatedTask = await this.taskRepository.updateTaskWorkflow<TaskDataUpdate, ITask>(id, taskData);
  
    return {
      ...updatedTask,
      workflow: transformWorkflow(updatedTask.workflow as WorkflowCode),
    };
  }

  public async deleteTask(
    request: IExtendedRequest,
    { id }: { id: string }
  ) {
    const task = await this.taskRepository.findById<ITask>(id);

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    if (task.authorId !== request.user!.id) {
      throw new ForbiddenError('You do not have permission to delete this task');
    }

    return this.taskRepository.delete(id);
  }
}
