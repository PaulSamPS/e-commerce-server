import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class SharesModel extends Model {
  @Column({ type: DataType.JSONB })
  images;

  @Column
  name: string;

  @Column
  path: string;
}
