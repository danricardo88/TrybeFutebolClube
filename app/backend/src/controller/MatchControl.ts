import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import MatchService from '../services/MatchService';
import { IMatchControl } from '../interfaces/IMatch';

export default class MatchControl implements IMatchControl {
  private _service: MatchService;

  constructor() {
    this._service = new MatchService();
    this.listMatch = this.listMatch.bind(this);
    this.createMatch = this.createMatch.bind(this);
  }

  public async listMatch(req: Request, res: Response): Promise<void> {
    const { inProgress } = req.query;

    const match = inProgress === undefined
      ? await this._service.getMatch()
      : await this._service.getMatchProgress(String(inProgress));
    res.status(StatusCodes.OK).json(match);
  }

  public async createMatch(req: Request, res: Response): Promise<void> {
    const newMatch = await this._service.createNewMatch(req.body);
    res.status(StatusCodes.CREATED).json(newMatch);
  }
}
