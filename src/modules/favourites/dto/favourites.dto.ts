import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

@Injectable()
export class FavouritesDto {
  @IsNotEmpty()
  readonly productId: string;
}
