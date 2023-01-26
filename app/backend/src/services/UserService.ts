import { compare } from 'bcryptjs';
import IUserService from '../interfaces/IUserService';
import HttpExcep from '../utils/HttpExcep';
import User from '../database/models/UserMod';
import { ILogin } from '../interfaces';
import TokenUtils from '../utils/tokens';

class UserService implements IUserService {
  constructor(private _tokenUtils = new TokenUtils()) {}

  public async login(credentials: ILogin): Promise<string> {
    if (!credentials.email || !credentials.password) {
      throw new HttpExcep(400, 'All fields must be filled');
    }

    const user = await User.findOne({ where: { email: credentials.email } });
    if (!user || !(await compare(credentials.password, user.password))) {
      throw new HttpExcep(401, 'Incorrect email or password');
    }

    const token = await this._tokenUtils.generate(user.id);
    return token;
  }
}

export default UserService;
