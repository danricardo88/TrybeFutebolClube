import { Request, Response } from 'express';

export interface ITeam {
  id: number;
  teamName: string;
}

export interface ITeamControl {
  allTeam(req: Request, res: Response): Promise<void>;
  listById(req: Request, res: Response): Promise<void>;
}

export interface ITeamService {
  getAllTeam(): Promise<ITeam[]>;
  getById(id: number): Promise<ITeam>;
}
