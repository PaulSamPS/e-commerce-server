import { ApiProperty } from '@nestjs/swagger';

export class CartItem {
  @ApiProperty({ example: 1500 })
  price: number;

  @ApiProperty({ example: 'Toto' })
  name: string;

  @ApiProperty({ example: 10 })
  in_stock: number;

  @ApiProperty({ example: '6.6' })
  weight: string;

  @ApiProperty({ example: 1 })
  count: number;

  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({
    example: '/static/Toto23/044191c361179d10fc28112f76e8b20e.webp',
  })
  image: string;

  @ApiProperty({ example: '2023-05-20T03:41:08.682Z' })
  updatedAt: string;

  @ApiProperty({ example: '2023-05-20T03:41:08.682Z' })
  createdAt: string;
}
