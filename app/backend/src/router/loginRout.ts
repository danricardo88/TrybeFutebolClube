import 'express-async-errors';
import { Router } from 'express';
import authMid from '../middlewares/AuthMid';
import { userControl } from './instancesControl';

const router = Router();

router.post('/', userControl.login);

router.get('/validate', authMid, userControl.getUserRole);

export default router;
