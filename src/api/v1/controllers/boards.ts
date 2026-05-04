import type { NextFunction, Response } from 'express';
import { NotFoundError } from '../../../common/errors';

import { StatusCodes, type IExtendedRequest } from '../../../interfaces';
import type { BoardService } from '../../../services';

type ConstructorParams = {
  boardService: BoardService;
};

export class BoardController {
  private boardService: BoardService;

  constructor({ boardService }: ConstructorParams) {
    this.boardService = boardService;
  }

/*   public async getBoardTasks(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const tasks = await this.boardService.getBoardTasks(req);

      res.status(StatusCodes.SUCCESS).json({ data: tasks });
    } catch (error) {
      req?.log?.error(`Failed to fetch tasks for board with id ${req.params.boardId}`, { error });

      next(error);
    }
  } */

  public async streamBoardTasks(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { boardId } = req.params;
      
      res.setHeader('Content-Type', 'application/x-ndjson');
      res.setHeader('Transfer-Encoding', 'chunked');

      await this.boardService.streamBoardTasks(req, (task) => {
        res.write(JSON.stringify(task) + '\n');
      });

      res.end();
    } catch (error) {
      req?.log?.error(`Error streaming tasks for board ${req.params.boardId}`, { error });
      
      if (!res.headersSent) {
        return next(error);
      }
      
      res.write(JSON.stringify({ error: (error as Error).message }));
      res.end();
    }
  }

  public async getBoards(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const boards = await this.boardService.getAllBoards(req);

      res.status(StatusCodes.SUCCESS).json({ data: boards });
    } catch (error) {
      req?.log?.error(`Failed to fetch boards`, { error });

      next(error);
    }
  }

  public async getBoardById(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { boardId = '' } = req.params;
      const board = await this.boardService.getBoardById(req, { id: boardId as string });
  
      res.status(StatusCodes.SUCCESS).json({ data: board });
    } catch (error) {
      req?.log?.error(`Failed to fetch board with id ${req.params.boardId}`, { error });

      next(error);
    }
  }

  public async createBoard(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const boardData = req.body;
      const newBoard = await this.boardService.createBoard(req, { boardData });

      res.status(StatusCodes.CREATED).json({ data: newBoard });
    } catch (error) {
      req?.log?.error(`Failed to create board`, { error });

      next(error);
    }
  }

  public async updateBoard(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { boardId = '' } = req.params;
      const boardData = req.body;

      const updatedBoard = await this.boardService.updateBoard(req, { id: boardId as string, boardData });

      res.status(StatusCodes.SUCCESS).json({ data: updatedBoard });
    } catch (error) {
      req?.log?.error(`Failed to update board with id ${req.params.boardId}`, { error });

      next(error);
    }
  }

  public async deleteBoard(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { boardId = '' } = req.params;

      await this.boardService.deleteBoard(req, { id: boardId as string });

      res.status(StatusCodes.DELETED).json();
    } catch (error) {
      req?.log?.error(`Failed to delete board with id ${req.params.boardId}`, { error });

      next(error);
    }
  }
}
