import { ApiProperty } from '@nestjs/swagger';
import { FeedDto } from './feed.dto';

export class PaginatedFeedsDto {
  @ApiProperty({
    type: [FeedDto],
    description: 'List of feeds',
  })
  items: FeedDto[];

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPreviousPage: boolean;
}
