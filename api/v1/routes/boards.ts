import { Router, type Request, type Response, type NextFunction } from 'express';
import { type ExtendedRequest } from '../../../interfaces/index';
import BOARDS from '../../../mock/boards.json' assert { type: 'json' };
import TASKS from '../../../mock/task.json' assert { type: 'json' };

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(BOARDS);
});

router.get('/:boardId', (req: ExtendedRequest & Request, res: Response, next: NextFunction) => {
    const { boardId } = req.params;

    const board = BOARDS.find(board => String(board.id) === boardId);

    if( !board ) {
        req.log?.info("Board bot found", { boardId });
        return next(new Error("Board not found!"));
    }

    req.log?.info('Board accessed', { boardId, userId: req?.user?.id });
    res.status(200).json(board);

});

router.get('/:boardId/tasks', (req: ExtendedRequest & Request, res: Response, next: NextFunction) => {
    const { boardId } = req.params;
    const userId = req.user?.id;

    const board = BOARDS.find(b => b.id === boardId);

    if (!board) {
        req.log?.info("Board not found", { boardId });
        return next(new Error("Board not found! Tasks of board can't found!"));
    }

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const filteredTasks = TASKS
        .filter(task => task.authorId === userId)
        .filter(task => task.boardId === boardId);

    req.log?.info('Tasks of Board accessed', { boardId, userId });

    return res.status(200).json(filteredTasks);
});

export { router }
