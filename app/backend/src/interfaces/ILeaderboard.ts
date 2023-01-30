export interface ILeaderboard extends matchScor {
  name: string;
  totalGames: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: string;
}

export type matchGol = {
  homeGoals: number;
  awayGoals: number;
};

export type matchScor = {
  totalPoints: number;
  totalVictories: number;
  totalLosses: number;
  totalDraws: number;
};
