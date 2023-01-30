import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { LeaderboardService } from '../services';

class LeaderboardControl {
  private _service: LeaderboardService;

  constructor() {
    this._service = new LeaderboardService();

    this.listHomeTeams = this.listHomeTeams.bind(this);
  }

  async listHomeTeams(_req: Request, res: Response): Promise<void> {
    const teams = await this._service.getHomeTeamsLeaderboard();
    res.status(StatusCodes.OK).json(teams);
  }
}

export default LeaderboardControl;
