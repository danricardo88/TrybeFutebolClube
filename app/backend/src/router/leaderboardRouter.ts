import 'express-async-errors';
import { Router } from 'express';
import { leaderboardControl } from './instancesControl';

const router = Router();

router.get('/home', leaderboardControl.listHomeTeams);

export default router;
