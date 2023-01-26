import * as jsonwebtokens from 'jsonwebtoken';
import HttpExcep from './HttpExcep';

class TokenUtils {
  constructor(private jwt = jsonwebtokens) {}

  public generate(id: number): string {
    return this.jwt.sign({ id }, String(process.env.SECRET), {
      algorithm: 'HS256',
      expiresIn: '1d',
    });
  }

  public async authenticate(token: string) {
    try {
      const introspection = await this.jwt.verify(
        token,
        String(process.env.SECRET),
      );
      return introspection;
    } catch (e) {
      throw new HttpExcep(401, 'Token inválido.');
    }
  }
}

export default TokenUtils;
