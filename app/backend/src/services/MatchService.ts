import { IMatchService, IMatchDB } from '../interfaces/IMatch';
import Match from '../database/models/MatchMod';
import Teams from '../database/models/TeamsMod';

export default class MatchService implements IMatchService {
  private _repository = Match;

  public async getMatch(): Promise<IMatchDB[]> {
    const match = (await this._repository
      .findAll({
        include:
      [
        { model: Teams, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Teams, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
      })) as IMatchDB[];

    return match;
  }

  public async getMatchProgress(status: string): Promise<IMatchDB[]> {
    const inProgress = status === 'true';
    const match = (await this._repository
      .findAll({
        include:
        [
          { model: Teams, as: 'teamHome', attributes: { exclude: ['id'] } },
          { model: Teams, as: 'teamAway', attributes: { exclude: ['id'] } },
        ],

        where: { inProgress },
      })) as IMatchDB[];

    return match;
  }
}
