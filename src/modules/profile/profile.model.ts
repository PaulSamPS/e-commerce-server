import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UsersModel } from '@/modules/users';

@Table({ tableName: 'profile' })
export class ProfileModel extends Model {
  @ForeignKey(() => UsersModel)
  user: UsersModel;

  @Column
  firstname: string;

  @Column
  lastname: string;

  @Column
  middleName: string;

  @Column
  phoneNumber: string;

  @Column
  region: string;

  @Column
  city: string;

  @Column
  address: string;
}
