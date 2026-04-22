import express, { type Request, type Response, type NextFunction } from 'express';

import BOARDS from './mock/boards.json' assert { type: 'json' };
import TASKS from './mock/task.json' assert { type: 'json' };


const app = express();

const user = {
  id: '37d42238-a84d-47c4-8030-e3d0e91d43de'
};


app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send("you on Home Page! welcome");
});

app.post('/api/v1/auth/sign-up', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "You signed up successfuly" });
});

app.post('/api/v1/auth/sign-in', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "You signed in successfuly" });
});


app.get('/api/v1/boards', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(BOARDS);
});

app.get('/api/v1/boards/:boardId', (req: Request, res: Response, next: NextFunction) => {
    const { boardId } = req.params;
    const board = BOARDS.find(board => board.id = boardId);
    res.status(200).json(board);
});

app.get('/api/v1/boards/:boardId/tasks', (req: Request, res: Response, next: NextFunction) => {
    const { boardId } = req.params;

    if(boardId) {
        const filteredTasks = TASKS.
        filter(task => task.authorId === user.id).
        filter(task => task.boardId === boardId)

        res.status(200).json(filteredTasks);
    }

    res.status(422).json({masage : "you need chouse another boardId"});

});

app.get('/api/v1/tasks', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(TASKS);
});

app.get('/api/v1/tasks/:taskId', (req: Request, res: Response, next: NextFunction) => {
    const { taskId } = req.params;

    const filteredTask = TASKS
        .find(task => task.id === taskId);

    res.status(200).json(filteredTask);
});

export { app };