import { MongooseRepository } from './base';
import { Board } from '../../models';
import { IBoard, IBoardRepository } from '../../interfaces';

export class BoardRepository extends MongooseRepository<IBoard> implements IBoardRepository {
    constructor() {
        super(Board);
    }

    public async getBoardsStatistics(userId: string) {
        const pipeline = [
        {
            $match: { authorId: userId }
        },
        {
            $lookup: {
            from: 'tasks',
            localField: 'id',
            foreignField: 'boardId',
            as: 'tasks'
            }
        },
        {
            $project: {
            _id: 0,
            id: 1,
            name: 1,
            tasksCount: { $size: '$tasks' },
            completedTasks: {
                $size: {
                $filter: {
                    input: '$tasks',
                    as: 'task',
                    cond: { $eq: ['$$task.workflow', 'done'] }
                }
                }
            }
            }
        }
        ];

        // Используем метод из базового класса (base.ts)
        return this.aggregate(pipeline);
    }
}

