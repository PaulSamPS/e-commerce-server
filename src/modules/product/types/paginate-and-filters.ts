import { ApiProperty } from '@nestjs/swagger';
import { ProductRequest, ProductResponse } from './product';

export class PaginateAndFilters {
  @ApiProperty({ example: 10 })
  count: number;
  @ApiProperty({ type: ProductRequest, isArray: true })
  rows: ProductResponse[];
}
