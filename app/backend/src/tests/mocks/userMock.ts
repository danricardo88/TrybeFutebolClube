import * as bcryptjs from 'bcryptjs';
import { ILogin, IUser } from '../../interfaces';

export const userMock: IUser = {
  id: 1,
  username: 'Idea',
  role: 'admin',
  email: 'idea@paraemail.com',
  password: await bcryptjs.hash('xablau123', 21),
};

export const loginMock: ILogin = {
  email: 'idea@paraemail.com',
  password: await bcryptjs.hash('xablau123', 21),
};

export const invalidLogins: ILogin[] = [
  {
    email: '',
    password: 'pirimplimplim',
  },
  {
    email: 'parara@paraemail.com',
    password: '',
  },
  {
    email: 'parara@paraemail',
    password: await bcryptjs.hash('xablau123', 21),
  },
];