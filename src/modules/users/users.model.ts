import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ReviewModel } from '@/modules/review/review.model';

@Table({ tableName: 'users' })
export class UsersModel extends Model<UsersModel> {
  @Column({ type: DataType.STRING })
  username: string;

  @Column({ type: DataType.TEXT })
  email: string;

  @Column({ type: DataType.TEXT })
  password: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  activated: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isAdmin: boolean;

  @HasMany(() => ReviewModel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  reviews: ReviewModel;
}
