import 'express-async-errors';
import { Router } from 'express';
import authMid from '../middlewares/AuthMid';
import { UserControl } from '../controller';

const router = Router();

const userControl = new UserControl();

router.post('/', userControl.login);

router.get('/validate', authMid, userControl.getUserRole);

export default router;
