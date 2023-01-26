import { Router } from 'express';
import 'express-async-errors';
import UserService from '../services';
import UserControl from '../controller';

const router = Router();

const userService = new UserService();
const userController = new UserControl(userService);

router.post('/', userController.login);

export default router;
