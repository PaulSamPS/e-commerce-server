import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UsersModel } from '@/modules/users';
import { ProductsModel } from '@/modules/product/products.model';

@Table({ tableName: 'reviews' })
export class ReviewModel extends Model<ReviewModel> {
  @ForeignKey(() => UsersModel)
  user: number;

  @ForeignKey(() => ProductsModel)
  product: number;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column({ defaultValue: 0 })
  rating: number;

  @Column({ type: DataType.TEXT })
  review: string;

  @Column({ defaultValue: false })
  approved: boolean;
}
