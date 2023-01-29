import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TeamService } from '../services';
import { ITeamControl } from '../interfaces/ITeam';

export default class TeamControl implements ITeamControl {
  private _service: TeamService;

  constructor() {
    this._service = new TeamService();
    this.allTeam = this.allTeam.bind(this);
    this.listById = this.listById.bind(this);
  }

  public async allTeam(_req: Request, res: Response): Promise<void> {
    const teams = await this._service.getAllTeam();
    res.status(StatusCodes.OK).json(teams);
  }

  public async listById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const team = await this._service.getById(Number(id));
    res.status(StatusCodes.OK).json(team);
  }
}
