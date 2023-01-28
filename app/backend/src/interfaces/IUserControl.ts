import { Request, Response } from 'express';

export default interface IUserControl {
  login(req: Request, res: Response): Promise<void>;
  getUserRole(req: Request, res: Response): Promise<void>;
}
