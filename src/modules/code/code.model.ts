import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'codes' })
export class CodeModel extends Model<CodeModel> {
  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.INTEGER })
  code: number;
}
