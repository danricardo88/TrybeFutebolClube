import { Model, INTEGER, STRING } from 'sequelize';
import { IUser } from '../../interfaces/IUser';
import db from '.';

class Users extends Model implements IUser {
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
