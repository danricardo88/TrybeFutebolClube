import HttpExcep from '../utils/HttpExcep';
import
{
  IMatchService,
  IMatchDB,
  IMatch,
  INewM,
} from '../interfaces/IMatch';
import Match from '../database/models/MatchMod';
import Teams from '../database/models/TeamsMod';
import { matchSchema } from '../validate/schema';

export default class MatchService implements IMatchService {
  private _repository = Match;
  private _teamRepository = Teams;

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

  private static validateMatchSchema(match: INewM): void {
    const { error } = matchSchema.validate(match);
    if (error) throw new HttpExcep(400, 'All fields must be filled');
  }

  private async validateMatchTeams({ homeTeam, awayTeam }: INewM) {
    if (homeTeam === awayTeam) {
      throw new HttpExcep(
        422,
        'It is not possible to create a match with two equal teams',
      );
    }

    const validHomeTeam = await this._teamRepository.findByPk(homeTeam);
    const validAwayTeam = await this._teamRepository.findByPk(awayTeam);
    if (!validHomeTeam || !validAwayTeam) {
      throw new HttpExcep(404, 'There is no team with such id!');
    }
  }

  public async createNewMatch(match: INewM): Promise<IMatch> {
    MatchService.validateMatchSchema(match);
    await this.validateMatchTeams(match);

    const newMatch = await this._repository.create({
      ...match,
      inProgress: true,
    });
    return newMatch;
  }
}
