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

const INCLUDE = [
  { model: Teams, as: 'teamHome', attributes: { exclude: ['id'] } },
  { model: Teams, as: 'teamAway', attributes: { exclude: ['id'] } },
];

export default class MatchService implements IMatchService {
  private _repository = Match;
  private _teamRepository = Teams;

  async getMatch(): Promise<IMatchDB[]> {
    const match = (await this._repository
      .findAll({
        include: INCLUDE,
      })) as IMatchDB[];

    return match;
  }

  async getMatchProgress(status: string): Promise<IMatchDB[]> {
    const inProgress = status === 'true';
    const match = (await this._repository
      .findAll({
        include: INCLUDE,
        where: { inProgress },
      })) as IMatchDB[];

    return match;
  }

  private static validateMatchSchema(match: INewM): void {
    const { error } = matchSchema.validate(match);
    if (error) throw new HttpExcep(400, 'All fields must be filled');
  }

  private async validateMatchTeams({ homeTeamId, awayTeamId }: INewM) {
    if (homeTeamId === awayTeamId) {
      throw new HttpExcep(
        422,
        'It is not possible to create a match with two equal teams',
      );
    }

    const validHomeTeam = await this._teamRepository.findByPk(homeTeamId);
    const validAwayTeam = await this._teamRepository.findByPk(awayTeamId);
    if (!validHomeTeam || !validAwayTeam) {
      throw new HttpExcep(404, 'There is no team with such id!');
    }
  }

  async createNewMatch(match: INewM): Promise<IMatch> {
    MatchService.validateMatchSchema(match);
    await this.validateMatchTeams(match);

    const newMatch = await this._repository.create({
      ...match,
      inProgress: true,
    });
    return newMatch;
  }

  async finishMatch(id: number): Promise<void> {
    const [result] = await this._repository.update(
      { inProgress: false },
      { where: { id } },
    );
    if (result !== 1) throw new HttpExcep(404, 'Update unsuccessful');
  }
}
