import { Request, Response } from 'express';
import { IUserControl } from '../interfaces';
import UserService from '../services';

export default class UserControl implements IUserControl {
  constructor(private _userService: UserService) {
    this.login = this.login.bind(this);
  }

  public async login(req: Request, res: Response): Promise<void> {
    const token = await this._userService.login(req.body);
    res.status(200).json({ token });
  }
}
