import { IsOptional, IsArray, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for querying digests.
 */
export class QueryDigestDto {
  @ApiPropertyOptional({
    description: 'Array of digest IDs to filter by',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  ids?: string[];

  @ApiPropertyOptional({
    description: 'Page number for pagination. Defaults to 1.',
    type: Number,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Limit per page for pagination. Defaults to 10.',
    type: Number,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
