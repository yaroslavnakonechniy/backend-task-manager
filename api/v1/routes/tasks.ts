import { Request, Router, type Response, type NextFunction } from 'express';
import { type ExtendedRequest } from '../../../interfaces/index';
import TASKS from '../../../mock/task.json' assert { type: 'json' };

const router = Router();

router.get('/', (req: ExtendedRequest, res: Response, next: NextFunction) => {
    req.log?.info('Tasks accesed!');
    res.status(200).json(TASKS);
});

router.get('/:taskId', (req: ExtendedRequest & Request, res: Response, next: NextFunction) => {
    const { taskId } = req.params;

    const task = TASKS.find(t => t.id === taskId);

    if (!task) {
        req.log?.info('Task not found', { taskId });
        return next(new Error(`Task with id ${taskId} not found!`));
    }

    req.log?.info('Task accessed by taskId!', { taskId });
    res.status(200).json(task);
});

export { router }
