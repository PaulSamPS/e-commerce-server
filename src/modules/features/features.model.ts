import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProductsModel } from '@/modules/product/products.model';
import { FeaturesArr } from '@/modules/features/dto/features.dto';

@Table({ tableName: 'features' })
export class FeaturesModel extends Model<FeaturesModel> {
  @Column
  productName: string;

  @Column({ type: DataType.JSONB })
  features: FeaturesArr[];

  @ForeignKey(() => ProductsModel)
  product: number;
}
