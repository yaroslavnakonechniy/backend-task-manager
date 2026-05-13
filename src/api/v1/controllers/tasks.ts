import type { Response, NextFunction } from 'express';
import type { TaskService } from '../../../services';
import { StatusCodes, type IExtendedRequest } from '../../../interfaces';

type ConstructorParams = {
  taskService: TaskService;
};

export class TaskController {
  private taskService: TaskService;

  constructor({ taskService }: ConstructorParams) {
    this.taskService = taskService;
  }

  public async streamTasks(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { boardId } = req.query;

      res.setHeader('Content-Type', 'application/x-ndjson');
      res.setHeader('Transfer-Encoding', 'chunked');

      await this.taskService.streamTasks(req, (task) => {
        res.write(JSON.stringify(task) + '\n');
      }, boardId as string);

      res.end();
    } catch (error) {
      if (!res.headersSent) {
        next(error);
      } else {
        res.write(JSON.stringify({ error: 'Stream interrupted' }));
        res.end();
      }
    }
  }

  public async getTaskById(req: IExtendedRequest, res: Response, next: NextFunction) {
    const { taskId = '' } = req.params;

    try {
      const task = await this.taskService.getTaskById(req, { id: taskId as string });

      res.status(StatusCodes.SUCCESS).json({ data: task });
    } catch (error) {
      req?.log?.error(`Failed to fetch task with id ${taskId as string}`, { error });

      next(error);
    }
  }

  public async createTask(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const taskData = req.body;
      const newTask = await this.taskService.createTask(req, { taskData });

      res.status(StatusCodes.CREATED).json({ data: newTask });
    } catch (error) {
      req?.log?.error(`Failed to create task`, { error });

      next(error);
    }
  }

  public async updateTask(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const taskData = req.body;

      const updatedTask = await this.taskService.updateTask(req, { id: taskId as string, taskData });

      res.status(StatusCodes.UPDATED).json({ data: updatedTask });
    } catch (error) {
      req?.log?.error(`Failed to update task with id ${req.params.taskId}`, { error });

      next(error);
    }
  }

  public async updateTaskWorkflow(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
      const { workflow } = req.body;

      const updatedTask = await this.taskService.updateTaskWorkflow(req, { id: taskId as string, taskData: { workflow } });

      res.status(StatusCodes.UPDATED).json({ data: updatedTask });
    } catch (error) {
      req?.log?.error(`Failed to update workflow for task with id ${req.params.taskId}`, { error });

      next(error);
    }
  }

  public async deleteTask(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { taskId } = req.params;
  
      await this.taskService.deleteTask(req, { id: taskId as string });

      res.status(StatusCodes.DELETED).send();
    } catch (error) {
      req?.log?.error(`Failed to delete task with id ${req.params.taskId}`, { error });

      next(error);
    }
  }
}
