import  { Router } from 'express';

import { authVerification } from '../../../middlewares';
import { createAuthRouter } from './auth';
import { createBoardRouter } from './boards';
import { createTaskRouter } from './tasks';

const router = Router();

router.use('/auth', createAuthRouter());
router.use('/boards', authVerification, createBoardRouter());
router.use('/tasks', authVerification, createTaskRouter());

export { router };

