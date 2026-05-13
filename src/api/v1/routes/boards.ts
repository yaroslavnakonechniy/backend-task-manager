import { Router } from 'express';
import { body } from 'express-validator';

import { BoardRepository, TaskRepository } from '../../../repositories/mongoose';
import { BoardService } from '../../../services';
import { BoardController } from '../controllers';

export const createBoardRouter = (): Router => {
  const router = Router();

  const boardRepository = new BoardRepository();
  const taskRepository = new TaskRepository();
  const service = new BoardService({ boardRepository, taskRepository });
  const controller = new BoardController({ boardService: service });

  router.get('/statistics', controller.getBoardStats.bind(controller));

  router.get('/', controller.getBoards.bind(controller));

  router.get('/:boardId/tasks', controller.streamBoardTasks.bind(controller));

  router.get('/:boardId', controller.getBoardById.bind(controller));

  router.post(
    '/',
    [
      body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required'),
      body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    ],
    controller.createBoard.bind(controller)
  );

  router.put(
    '/:boardId',
    [
      body('name')
        .trim()
        .optional(),
      body('description')
        .trim()
        .optional()
    ],
    controller.updateBoard.bind(controller)
  );

  router.delete('/:boardId', controller.deleteBoard.bind(controller));

  return router;
};
