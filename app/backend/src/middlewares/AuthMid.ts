import { NextFunction, Request, Response } from 'express';
import TokenUtils from '../utils/tokens';

export default async function authMid(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token: string = req.headers.authorization || '';
  const tokenUtils = new TokenUtils();
  res.locals.userIddentifier = await tokenUtils.authenticate(token, next);
  next();
}
