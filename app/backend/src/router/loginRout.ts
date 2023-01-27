import 'express-async-errors';
import { Router } from 'express';
import authMid from '../middlewares/AuthMid';
import UserService from '../services';
import UserControl from '../controller';

const router = Router();

const userService = new UserService();
const userController = new UserControl(userService);

router.post('/', userController.login);

router.get('/validate', authMid, userController.getUserRole);

export default router;
