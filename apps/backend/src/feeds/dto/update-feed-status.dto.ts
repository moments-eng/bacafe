import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateFeedStatusDto {
  @ApiProperty({
    description: 'Whether the feed is active',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Scraping interval in minutes (-1 for inactive)',
    example: 5,
    required: false,
    minimum: -1,
  })
  @IsOptional()
  @IsNumber()
  @Min(-1)
  scrapingInterval?: number;
}
