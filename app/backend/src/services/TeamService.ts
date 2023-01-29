import HttpExcep from '../utils/HttpExcep';
import { ITeamService, ITeam } from '../interfaces/ITeam';
import Teams from '../database/models/TeamsMod';

export default class TeamService implements ITeamService {
  private _repository = Teams;

  public async getAllTeam(): Promise<ITeam[]> {
    const teams = await this._repository.findAll();
    return teams;
  }

  public async getById(id: number): Promise<ITeam> {
    const teams = await this._repository.findByPk(id);

    if (!teams) throw new HttpExcep(404, 'There is no team with such id!');
    return teams;
  }
}
