import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

interface IUsers {
  id: number;
  username: string;
  role: string;
  email: string;
  password: string;
}

type IUsersCreatAtr = Omit<IUsers, 'id'>;

type IUsersReturn = Omit<IUsers, 'password'>;

class Users extends Model<IUsers, IUsersCreatAtr> {
  declare id: number;
  declare username: string;
  declare role: string;
  declare email: string;
  declare password: string;
}

Users.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: STRING,
    role: STRING,
    email: STRING,
    password: STRING,
  },
  {
    sequelize: db,
    modelName: 'users',
    tableName: 'users',
    timestamps: false,
  },
);

export default Users;
export { IUsers, IUsersCreatAtr, IUsersReturn };
