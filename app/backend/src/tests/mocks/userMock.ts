import ILogin from '../../interfaces/ILogin';
import { IUsers } from '../../database/models/UserMod';
import IToken from '../../interfaces/ITokens';

export const Token: IToken = {
  data: {
    id: 1,
    email: 'danric@parara.com',
  },
};

export const userMock: IUsers = {
  id: 1,
  username: 'Arezu',
  role: 'admin',
  email: 'danric@parara.com',
  password: 'criptomoeda',
};

export const loginMock: ILogin = {
  email: 'danric@parara.com',
  password: 'criptomoeda',
};

export const invalidLogins: ILogin[] = [
  {
    email: '',
    password: 'isispincesa',
  },
  {
    email: 'sanji@parara.com',
    password: '',
  },
  {
    email: 'sanji@parara',
    password: 'marimozoro',
  },
];