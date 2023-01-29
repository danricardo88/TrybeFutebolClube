import { Request, Response } from 'express';
import Match from '../database/models/MatchMod';

export interface IMatch extends INewM {
  id: number;
  inProgress: boolean;
}

export interface IMatchUpdate {
  homeTeamGoals: number;
  awayTeamGoals: number;
}
export interface INewM extends IMatchUpdate {
  homeTeamId: number;
  awayTeamId: number;
}

export interface IMatchInfo extends IMatch {
  teamHome: { teamName: string };
  teamAway: { teamName: string };
}

export interface IMatchDB extends IMatchInfo, Match {}

export interface IMatchControl {
  listMatch(req: Request, res: Response): Promise<void>;
  createMatch(req: Request, res: Response): Promise<void>;
  finishMatch(req: Request, res: Response): Promise<void>;
  upMatch(req: Request, res: Response): Promise<void>;
}

export interface IMatchService {
  getMatch(): Promise<IMatchDB[]>;
  getMatchProgress(status: string): Promise<IMatchDB[]>;
  createNewMatch(match: INewM): Promise<IMatch>;
  finishMatch(id: number): Promise<void>;
  upMatch(values: IMatchUpdate, id: number): Promise<void>;
}
