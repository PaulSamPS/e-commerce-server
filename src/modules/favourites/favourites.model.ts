import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { UsersModel } from '@/modules/users';

@Table
export class FavouritesModel extends Model {
  @ForeignKey(() => UsersModel)
  user: UsersModel;

  @Column({
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  products;
}
