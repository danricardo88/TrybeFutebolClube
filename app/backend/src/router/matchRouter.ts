import 'express-async-errors';
import { Router } from 'express';
import { matchControl } from './instancesControl';
import authMid from '../middlewares/AuthMid';

const router = Router();

router.get('/', matchControl.getAll);
router.post('/', authMid, matchControl.createMatch);
router.patch('/:id/finish', matchControl.finishMatch);
router.patch('/:id', matchControl.upMatch);

export default router;
