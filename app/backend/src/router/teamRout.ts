import 'express-async-errors';
import { Router } from 'express';
import { teamControl } from './instancesControl';

const router = Router();

router.get('/', teamControl.allTeam);
router.get('/:id', teamControl.listById);

export default router;
