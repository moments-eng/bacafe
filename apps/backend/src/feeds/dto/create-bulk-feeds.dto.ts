import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateBulkFeedsDto {
  @ApiProperty({
    description: 'Provider name for all feeds',
    example: 'ynet',
  })
  @IsString()
  provider: string;

  @ApiProperty({
    description: 'Comma-separated list of RSS feed URLs',
    example: 'https://example1.com/rss,https://example2.com/rss',
  })
  @IsString()
  urls: string;

  @ApiProperty({
    description: 'Categories for all feeds',
    type: [String],
    example: ['tech', 'news'],
    required: false,
  })
  @IsArray()
  categories?: string[];
}
