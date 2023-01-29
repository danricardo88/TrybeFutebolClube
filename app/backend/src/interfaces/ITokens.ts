import { JwtPayload } from 'jsonwebtoken';

export default interface IToken extends JwtPayload {
  data: {
    id: number;
    email: string;
  };
}
