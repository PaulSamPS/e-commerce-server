import { ApiProperty } from '@nestjs/swagger';
import { ProductRequest, ProductResponse } from './product';

class BestSellers extends ProductResponse {
  @ApiProperty({ example: true })
  bestsellers: boolean;
}

export class BestSellersResponse {
  @ApiProperty({ example: 10 })
  count: number;
  @ApiProperty({ type: ProductRequest, isArray: true })
  rows: BestSellers;
}
