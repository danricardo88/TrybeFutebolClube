import { compare } from 'bcryptjs';
import { IUserService } from '../interfaces/IUser';
import HttpExcep from '../utils/HttpExcep';
import Users from '../database/models/UserMod';
import ILogin from '../interfaces/ILogin';
import TokenUtils from '../utils/tokens';
import { loginSchema } from '../validate/schema';

export default class UserService implements IUserService {
  private _repository = Users;

  constructor(private _tokenUtils = new TokenUtils()) {}

  private static validateLoginSchema(credentials: ILogin): void {
    const { error } = loginSchema.validate(credentials);
    if (error) {
      const statusCode = error.message.includes('email') ? 401 : 400;
      throw new HttpExcep(statusCode, error.message);
    }
  }

  async login(credentials: ILogin): Promise<string> {
    UserService.validateLoginSchema(credentials);

    const user = await this._repository.findOne({ where: { email: credentials.email } });

    if (!user || !(await compare(credentials.password, user.password))) {
      throw new HttpExcep(401, 'Incorrect email or password');
    }

    const token = await this._tokenUtils.generate(user.id);
    return token;
  }

  async getRole(id: number): Promise<string> {
    const user = await this._repository.findOne({ where: { id } });

    if (!user) throw new HttpExcep(404, 'User not found');
    return user.role;
  }
}
