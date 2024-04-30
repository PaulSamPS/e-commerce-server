import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { UsersModel } from '@/modules/users';

@Table({ tableName: 'cart' })
export class CartModel extends Model {
  @ForeignKey(() => UsersModel)
  user: UsersModel;

  @Column({
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  products;

  @Column({ defaultValue: 0 })
  total_price: number;

  @Column({ defaultValue: 0 })
  discount: number;
}
