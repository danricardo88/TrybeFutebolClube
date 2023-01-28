import 'express-async-errors';
import { Router } from 'express';
import TeamService from '../services/TeamService';
import TeamControl from '../controller/TeamControl';

const router = Router();

const teamService = new TeamService();
const teamsController = new TeamControl(teamService);

router.get('/', teamsController.allTeam);
router.get('/:id', teamsController.listById);

export default router;
