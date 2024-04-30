import { ApiProperty } from '@nestjs/swagger';

export class UpdateTotalPriceResponse {
  @ApiProperty({ example: 12000 })
  total_price: number;
}
export class UpdateTotalPriceRequest {
  @ApiProperty({ example: 12000 })
  total_price: number;
}
