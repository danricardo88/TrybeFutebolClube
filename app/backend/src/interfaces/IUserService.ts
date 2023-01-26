import ILogin from './ILogin';

export default interface IUserService {
  login(credentials: ILogin): Promise<string>;
}
