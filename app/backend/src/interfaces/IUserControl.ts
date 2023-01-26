import { Request, Response } from 'express';

export default interface IUserController {
  login(req: Request, res: Response): void;
}
