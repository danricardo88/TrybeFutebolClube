import 'express-async-errors';
import { Router } from 'express';
import { MatchControl } from '../controller';
import authMid from '../middlewares/AuthMid';

const matchControl = new MatchControl();

const router = Router();

router.get('/', matchControl.listMatch);
router.post('/', authMid, matchControl.createMatch);

export default router;
