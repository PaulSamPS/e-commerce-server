import { Column, Model, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table
export class DayProducts extends Model {
  @Column({
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  dayProducts;

  @Column({
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  productsYesterday;
}
