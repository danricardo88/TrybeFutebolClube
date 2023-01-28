import 'express-async-errors';
import { Router } from 'express';
import TeamControl from '../controller/TeamControl';

const router = Router();

const teamsController = new TeamControl();

router.get('/', teamsController.allTeam);
router.get('/:id', teamsController.listById);

export default router;
