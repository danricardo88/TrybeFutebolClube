import { Request, Response } from 'express';
import { TeamService } from '../services';
import { ITeamControl } from '../interfaces';

export default class TeamControl implements ITeamControl {
  constructor(private _service: TeamService) {
    this.allTeam = this.allTeam.bind(this);
    this.listById = this.listById.bind(this);
  }

  public async allTeam(_req: Request, res: Response): Promise<void> {
    const teams = await this._service.getAllTeam();
    res.status(200).json(teams);
  }

  public async listById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const team = await this._service.getById(Number(id));
    res.status(200).json(team);
  }
}
