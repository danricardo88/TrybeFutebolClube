import 'express-async-errors';
import { Router } from 'express';
import { MatchControl } from '../controller';

const matchControl = new MatchControl();

const router = Router();

router.get('/', matchControl.listMatch);

export default router;
