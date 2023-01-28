import { Request, Response } from 'express';
import MatchService from '../services/MatchService';
import { IMatchControl } from '../interfaces/IMatch';

export default class MatchControl implements IMatchControl {
  private _service: MatchService;

  constructor() {
    this._service = new MatchService();
    this.listMatch = this.listMatch.bind(this);
  }

  public async listMatch(req: Request, res: Response): Promise<void> {
    const { inProgress } = req.query;

    const match = inProgress === undefined
      ? await this._service.getMatch()
      : await this._service.getMatchProgress(String(inProgress));
    res.status(200).json(match);
  }
}
