import HttpExcep from '../utils/HttpExcep';
import { ITeamService, ITeam } from '../interfaces';
import TeamRepository from '../database/models/TeamsModel';

export default class TeamService implements ITeamService {
  private _model = TeamRepository;

  public async getAllTeam(): Promise<ITeam[]> {
    const teams = await this._model.findAll();
    return teams;
  }

  public async getById(id: number): Promise<ITeam> {
    const team = await this._model.findByPk(id);
    if (!team) throw new HttpExcep(404, 'Team not found');
    return team;
  }
}
