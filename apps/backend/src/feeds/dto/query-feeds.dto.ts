import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsObject, IsOptional, IsString, Min, Max } from 'class-validator';

export class FeedFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by feed name',
    example: 'Tech News',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by feed URL',
    example: 'https://example.com/rss',
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({
    description: 'Filter by provider',
    example: 'ynet',
  })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({
    description: 'Filter by language',
    example: 'he',
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by categories',
    type: [String],
    example: ['tech', 'news'],
  })
  @IsOptional()
  categories?: string[];
}

export class FeedSortDto {
  @ApiPropertyOptional({
    description: 'Sort by name',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  name?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Sort by provider',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  provider?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Sort by last scraped date',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  lastScrapedAt?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description: 'Sort by creation date',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  createdAt?: 'asc' | 'desc';
}

export class QueryFeedsDto {
  @ApiPropertyOptional({
    description: 'Filter criteria',
    type: FeedFilterDto,
  })
  @IsOptional()
  @IsObject()
  filter?: FeedFilterDto;

  @ApiPropertyOptional({
    description: 'Sort criteria',
    type: FeedSortDto,
  })
  @IsOptional()
  @IsObject()
  sort?: FeedSortDto;

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
    maximum: 50,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 10;
}
