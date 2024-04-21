import {
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { ReviewModel } from '@/modules/review/review.model';
import { FeaturesModel } from '@/modules/features/features.model';

type Images = {
  url: string;
  name: string;
};
@Table({ tableName: 'products' })
export class ProductsModel extends Model<ProductsModel> {
  @HasMany(() => ReviewModel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  reviews: ReviewModel[];

  @HasOne(() => FeaturesModel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  features: FeaturesModel;

  @Column({ defaultValue: 0 })
  price: number;

  @Column({ defaultValue: 0 })
  oldPrice: number;

  @Column
  name: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.JSONB })
  images: Images[];

  @Column({ defaultValue: 0 })
  inStock: number;

  @Column({ defaultValue: false })
  bestseller: boolean;

  @Column({ defaultValue: false })
  isNew: boolean;

  @Column({ defaultValue: 0 })
  soldCount: number;

  @Column({ type: DataType.DOUBLE, defaultValue: 0 })
  rating: number;

  @Column({ defaultValue: 0 })
  discount: number;

  @Column
  category: string;
}
