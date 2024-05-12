import { IsString } from 'class-validator';

export class ProfileDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  middleName: string;

  @IsString()
  region: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsString()
  phoneNumber: string;
}
