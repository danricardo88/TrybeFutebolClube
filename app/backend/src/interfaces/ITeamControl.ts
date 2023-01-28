import { Request, Response } from 'express';

export default interface ITeamControl {
  allTeam(req: Request, res: Response): Promise<void>;
  listById(req: Request, res: Response): Promise<void>;
}
