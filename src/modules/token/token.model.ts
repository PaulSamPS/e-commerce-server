import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'tokens' })
export class TokensModel extends Model<TokensModel> {
  @Column({ type: DataTypes.INTEGER })
  userId: number;

  @Column({ type: DataTypes.TEXT })
  accessToken: string;

  @Column({ type: DataTypes.TEXT })
  refreshToken: string;
}
