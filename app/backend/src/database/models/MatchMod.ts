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
  homeTeam: number;
  awayTeam: number;
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
  declare homeTeam: number;
  declare homeTeamGoals: number;
  declare awayTeam: number;
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
    homeTeam: INTEGER,
    homeTeamGoals: INTEGER,
    awayTeam: INTEGER,
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

Teams.hasMany(Match, { foreignKey: 'homeTeam', as: 'homeTeamMatches' });
Teams.hasMany(Match, { foreignKey: 'awayTeam', as: 'awayTeamMatches' });

Match.belongsTo(Teams, { foreignKey: 'homeTeam', as: 'teamHome' });
Match.belongsTo(Teams, { foreignKey: 'awayTeam', as: 'teamAway' });

export default Match;
export { IMatch, IMatchUp, IMatchCreationAttrs, IMatchReturned };
