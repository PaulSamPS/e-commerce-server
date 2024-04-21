import { ApiProperty } from '@nestjs/swagger';
import { ProductRequest, ProductResponse } from './product';

class New extends ProductResponse {
  @ApiProperty({ example: true })
  new: boolean;
}

export class NewResponse {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ type: ProductRequest, isArray: true })
  rows: New;
}
