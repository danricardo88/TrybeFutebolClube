import { compare } from 'bcryptjs';
import { IUserService } from '../interfaces/IUser';
import HttpExcep from '../utils/HttpExcep';
import Users from '../database/models/UserMod';
import ILogin from '../interfaces/ILogin';
import TokenUtils from '../utils/tokens';

export default class UserService implements IUserService {
  private _repository = Users;

  constructor(private _tokenUtils = new TokenUtils()) {}

  public async login(credentials: ILogin): Promise<string> {
    if (!credentials.email || !credentials.password) {
      throw new HttpExcep(400, 'All fields must be filled');
    }

    const user = await this._repository.findOne({ where: { email: credentials.email } });

    if (!user || !(await compare(credentials.password, user.password))) {
      throw new HttpExcep(401, 'Incorrect email or password');
    }

    const token = await this._tokenUtils.generate(user.id);
    return token;
  }

  public async getRole(id: number): Promise<string> {
    const user = await this._repository.findOne({ where: { id } });

    if (!user) throw new HttpExcep(404, 'User not found');
    return user.role;
  }
}
