import { ApiProperty } from '@nestjs/swagger';
import { ProductResponse } from './product';

export class GetByNameRequest {
  @ApiProperty({ example: 'Bob' })
  name: string;
}
export class GetByNameResponse extends ProductResponse {}
