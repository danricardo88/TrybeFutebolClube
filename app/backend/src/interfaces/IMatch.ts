import { Request, Response } from 'express';
import Match from '../database/models/MatchMod';

export interface IMatch extends INewM {
  id: number;
  inProgress: boolean;
}

export interface INewM {
  homeTeam: number;
  awayTeam: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
}

export interface IMatchInfo extends IMatch {
  teamHome: { teamName: string };
  teamAway: { teamName: string };
}

export interface IMatchDB extends IMatchInfo, Match {}

export interface IMatchControl {
  listMatch(req: Request, res: Response): Promise<void>;
}

export interface IMatchService {
  getMatch(): Promise<IMatchDB[]>;
  getMatchProgress(status: string): Promise<IMatchDB[]>;
}
