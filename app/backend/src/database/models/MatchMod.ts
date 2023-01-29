import { BOOLEAN, INTEGER, Model } from 'sequelize';
import db from '.';
import Teams from './TeamsMod';

interface IMatch extends IMatchCreationAttrs {
  id: number;
  inProgress: boolean;
}

interface IMatchUp {
  homeTeamGoals: number;
  awayTeamGoals: number;
}

interface IMatchCreationAttrs extends IMatchUp {
  homeTeamId: number;
  awayTeamId: number;
}

interface IMatchReturned extends IMatch {
  teamHome: {
    teamName: string;
  };
  teamAway: {
    teamName: string;
  };
}

class Match extends Model implements IMatch {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

Match.init(
  {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    homeTeamId: INTEGER,
    homeTeamGoals: INTEGER,
    awayTeamId: INTEGER,
    awayTeamGoals: INTEGER,
    inProgress: BOOLEAN,
  },
  {
    sequelize: db,
    modelName: 'match',
    tableName: 'matches',
    underscored: true,
    timestamps: false,
  },
);

Teams.hasMany(Match, { foreignKey: 'homeTeamId', as: 'homeTeamMatches' });
Teams.hasMany(Match, { foreignKey: 'awayTeamId', as: 'awayTeamMatches' });

Match.belongsTo(Teams, { foreignKey: 'homeTeamId', as: 'homeTeam' });
Match.belongsTo(Teams, { foreignKey: 'awayTeamId', as: 'awayTeam' });

export default Match;
export { IMatch, IMatchUp, IMatchCreationAttrs, IMatchReturned };
