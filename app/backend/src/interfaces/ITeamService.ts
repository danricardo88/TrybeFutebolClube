import ITeam from './ITeam';

export default interface ITeamService {
  getAllTeam(): Promise<ITeam[]>;
  getById(id: number): Promise<ITeam>;
}
