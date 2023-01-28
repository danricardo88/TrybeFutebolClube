import { INewM, IMatch, IMatchInfo  } from "../../interfaces/IMatch";

export const matchMock: IMatchInfo[] = [
  {
    id: 1,
    homeTeam: 16,
    homeTeamGoals: 1,
    awayTeam: 8,
    awayTeamGoals: 1,
    inProgress: false,
    teamHome: 
    {
      teamName: 'Flamengo',
    },
    teamAway: 
    {
      teamName: 'Vasco',
    },
  },

  {
    id: 2,
    homeTeam: 9,
    homeTeamGoals: 1,
    awayTeam: 14,
    awayTeamGoals: 1,
    inProgress: true,
    teamHome: 
    {
      teamName: 'Internacional',
    },
    teamAway: 
    {
      teamName: 'Santos',
    },
  },
];

export const newMatch: INewM = {
  homeTeam: 16,
  awayTeam: 8,
  homeTeamGoals: 2,
  awayTeamGoals: 2,
};

export const invalidMatch: INewM[] = [
  {
    homeTeam: 16,
    awayTeam: 16,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
  },
  {
    homeTeam: 999,
    awayTeam: 8,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
  }
];

export const newMatchResp: IMatch = {
  id: 1,
  homeTeam: 16,
  awayTeam: 8,
  homeTeamGoals: 2,
  awayTeamGoals: 2,
  inProgress: true,
};