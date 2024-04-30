import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { ReviewModel } from '@/modules/review/review.model';
import { CartModel } from '@/modules/cart/cart.model';

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

  @HasOne(() => CartModel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  shoppingCart: CartModel;
}
