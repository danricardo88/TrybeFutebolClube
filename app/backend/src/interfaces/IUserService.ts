import ILogin from './ILogin';

export default interface IUserService {
  login(credentials: ILogin): Promise<string>;
  getRole(id: number): Promise<string>;
}
