import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  readonly productId: number;
}
