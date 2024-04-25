import { IsNotEmpty } from 'class-validator';

export class SharesDto {
  readonly images: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly path: string;
}
