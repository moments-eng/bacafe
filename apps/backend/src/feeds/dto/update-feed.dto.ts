import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateFeedDto {
  @ApiProperty({ description: 'Whether the feed is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Scraping interval in minutes',
    required: false,
    minimum: 1,
    maximum: 1440, // 24 hours
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1440)
  scrapingInterval?: number;

  @ApiProperty({ description: 'Feed name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Feed categories', required: false })
  @IsOptional()
  @IsString({ each: true })
  categories?: string[];
}
