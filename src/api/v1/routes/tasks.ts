import { Router } from 'express';
import { body, query } from 'express-validator';

import { BoardRepository, TaskRepository } from '../../../repositories//mongo-db';
import { TaskService } from '../../../services';
import { TaskController } from '../controllers';

export const createTaskRouter = (): Router => {
  const router = Router();

  const boardRepository = new BoardRepository();
  const taskRepository = new TaskRepository();
  const service = new TaskService({ boardRepository, taskRepository });
  const controller = new TaskController({ taskService: service });

  router.get(
    '/',
    [
      query('boardId')
        .notEmpty()
        .trim()
        .withMessage('boardId query parameter is required')
    ],
    controller.streamTasks.bind(controller)
  );

  router.get(
    '/:taskId',
    controller.getTaskById.bind(controller)
  );

  router.post(
    '/',
    [
      body('boardId')
        .notEmpty()
        .trim()
        .withMessage('boardId is required'),
      body('title')
        .notEmpty()
        .trim()
        .withMessage('Title is required'),
      body('description')
        .optional()
        .trim(),
      body('workflow')
        .optional()
        .isIn(['todo', 'progress', 'done'])
        .withMessage('Workflow must be one of: todo, progress, done'),
    ],
    controller.createTask.bind(controller)
  );

  router.put(
    '/:taskId',
    [
      body('title')
        .optional()
        .trim(),
      body('description')
        .optional()
        .trim(),
    ],
    controller.updateTask.bind(controller)
  );

  router.put(
    '/:taskId/workflow',
    [
      body('workflow')
        .notEmpty()
        .isIn(['todo', 'progress', 'done'])
        .withMessage('Workflow must be one of: todo, progress, done'),
    ],
    controller.updateTaskWorkflow.bind(controller)
  );

  router.delete(
    '/:taskId',
    controller.deleteTask.bind(controller)
  );

  return router;
};
