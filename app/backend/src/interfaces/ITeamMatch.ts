export type teamGoal = [
  {
    homeTeamGoals: number;
    awayTeamGoals: number;
  },
];

export interface IHomeTeamM {
  name: string;
  homeTeamMatches: teamGoal;
}

export interface IAwayTeamM {
  name: string;
  awayTeamMatches: teamGoal;
}
