import { INewM, IMatch, IMatchInfo, IMatchUpdate  } from "../../interfaces/IMatch";

export const matchMock: IMatchInfo[] = [
  {
    id: 1,
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
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
    homeTeamId: 9,
    homeTeamGoals: 1,
    awayTeamId: 14,
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
  homeTeamId: 16,
  awayTeamId: 8,
  homeTeamGoals: 2,
  awayTeamGoals: 2,
};

export const invalidMatch: INewM[] = [
  {
    homeTeamId: 16,
    awayTeamId: 16,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
  },
  {
    homeTeamId: 999,
    awayTeamId: 8,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
  }
];

export const missingField: Omit<INewM, 'homeTeamId'> = {
  awayTeamId: 8,
  homeTeamGoals: 2,
  awayTeamGoals: 2,
};

export const newMatchResp: IMatch = {
  id: 1,
  homeTeamId: 16,
  awayTeamId: 8,
  homeTeamGoals: 2,
  awayTeamGoals: 2,
  inProgress: true,
};

export const updateMatch: IMatchUpdate  = {
  homeTeamGoals: 7,
  awayTeamGoals: 1,
};