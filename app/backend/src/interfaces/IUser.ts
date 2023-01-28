import { Request, Response } from 'express';
import ILogin from './ILogin';

export interface IUser extends ILogin {
  id: number;
  username: string;
  role: string;
}

export interface IUserControl {
  login(req: Request, res: Response): Promise<void>;
  getUserRole(req: Request, res: Response): Promise<void>;
}

export interface IUserService {
  login(credentials: ILogin): Promise<string>;
  getRole(id: number): Promise<string>;
}
