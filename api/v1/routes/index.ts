import Router from 'express';
import { router as auth } from './auth';
import { router as boards } from './boards';
import { router as tasks } from './tasks';

const router = Router();

router.use('/auth', auth);
router.use('/boards', boards);
router.use('/tasks', tasks);

export { router }