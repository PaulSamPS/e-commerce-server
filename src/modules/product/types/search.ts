import { ApiProperty } from '@nestjs/swagger';
import { PaginateAndFilters } from './paginate-and-filters';

export class SearchRequest {
  @ApiProperty({ example: 'Dean' })
  search: string;
}
export class SearchResponse extends PaginateAndFilters {}
