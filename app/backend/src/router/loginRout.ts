import 'express-async-errors';
import { Router } from 'express';
import authMid from '../middlewares/AuthMid';
import { UserService } from '../services';
import { UserControl } from '../controller';

const router = Router();

const userService = new UserService();
const userControl = new UserControl(userService);

router.post('/', userControl.login);

router.get('/validate', authMid, userControl.getUserRole);

export default router;
