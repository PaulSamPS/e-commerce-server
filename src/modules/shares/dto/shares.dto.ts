import { IsNotEmpty } from 'class-validator';

export class SharesDto {
  @IsNotEmpty()
  readonly images: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly path: string;
}
