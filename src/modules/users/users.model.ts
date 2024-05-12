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
import { FavouritesModel } from '@/modules/favourites/favourites.model';
import { ProfileModel } from '@/modules/profile/profile.model';

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

  @HasOne(() => ProfileModel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  profile: ProfileModel;

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

  @HasMany(() => FavouritesModel, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  favourites: FavouritesModel;
}
