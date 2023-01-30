import Team from '../database/models/TeamsMod';
import Match from '../database/models/MatchMod';
import {
  ILeaderboard,
  matchGol,
  matchScor,
} from '../interfaces/ILeaderboard';
import {
  IHomeTeamM,
  IAwayTeamM,
  teamGoal,
} from '../interfaces/ITeamMatch';

export default class LeaderboardService {
  private _teamModel = Team;

  private static isHomeTeam(team: string): boolean {
    return team === 'homeTeam';
  }

  private async getMatchesData(
    team: string,
  ): Promise<IHomeTeamM[] | IAwayTeamM[]> {
    const opponent = LeaderboardService.isHomeTeam(team)
      ? 'awayTeam'
      : 'homeTeam';

    const dbMatches = await this._teamModel.findAll({
      include: [
        {
          model: Match,
          as: `${team}Matches`,
          attributes: [`${team}Goals`, `${opponent}Goals`],
          where: { inProgress: false },
        },
      ],
      attributes: [['team_name', 'name']],
    });

    const matches = dbMatches.map((match) => match.get({ plain: true }));
    return matches;
  }

  private static sumGoals(teamMatches: teamGoal): matchGol {
    const homeGoals = teamMatches.reduce(
      (acc, curr) => acc + curr.homeTeamGoals,
      0,
    );
    const awayGoals = teamMatches.reduce(
      (acc, curr) => acc + curr.awayTeamGoals,
      0,
    );
    return { homeGoals, awayGoals };
  }

  private static homeTeamPoints(matches: teamGoal): number {
    return matches.reduce(
      (acc, curr) => (curr.homeTeamGoals > curr.awayTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  private static awayTeamPoints(matches: teamGoal): number {
    return matches.reduce(
      (acc, curr) => (curr.awayTeamGoals > curr.homeTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  private static drawPoints(matches: teamGoal): number {
    return matches.reduce(
      (acc, curr) =>
        (curr.awayTeamGoals === curr.homeTeamGoals ? acc + 1 : acc),
      0,
    );
  }

  private static gamePoints(team: string, matches: teamGoal): matchScor {
    const totalVictories = LeaderboardService.isHomeTeam(team)
      ? LeaderboardService.homeTeamPoints(matches)
      : LeaderboardService.awayTeamPoints(matches);

    const totalLosses = LeaderboardService.isHomeTeam(team)
      ? LeaderboardService.awayTeamPoints(matches)
      : LeaderboardService.homeTeamPoints(matches);

    const totalDraws = LeaderboardService.drawPoints(matches);
    const totalPoints = totalVictories * 3 + totalDraws;

    return { totalPoints, totalVictories, totalLosses, totalDraws };
  }

  private static sortLeaderboard(leaderboard: ILeaderboard[]): ILeaderboard[] {
    return leaderboard.sort(
      (a, b) =>
        b.totalPoints - a.totalPoints
        || b.goalsBalance - a.goalsBalance
        || b.goalsFavor - a.goalsFavor
        || a.goalsOwn - b.goalsOwn,
    );
  }

  private static setLeaderboard(name: string, matches: teamGoal) {
    const goals = LeaderboardService.sumGoals(matches);
    const points = LeaderboardService.gamePoints('homeTeam', matches);
    const totalGames = matches.length;
    return {
      name,
      totalGames,
      ...points,
      goalsFavor: goals.homeGoals,
      goalsOwn: goals.awayGoals,
      goalsBalance: goals.homeGoals - goals.awayGoals,
      efficiency: ((points.totalPoints / (totalGames * 3)) * 100).toFixed(2),
    };
  }

  async getHomeTeamsLeaderboard(): Promise<ILeaderboard[]> {
    const homeMatches = (await this.getMatchesData(
      'homeTeam',
    )) as IHomeTeamM[];

    const leaderboard = homeMatches.map(({ name, homeTeamMatches }) =>
      LeaderboardService.setLeaderboard(name, homeTeamMatches));

    return LeaderboardService.sortLeaderboard(leaderboard);
  }
}
