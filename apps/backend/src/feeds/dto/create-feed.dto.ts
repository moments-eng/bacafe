import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateFeedDto {
  @ApiProperty({
    description: 'The news provider name (e.g., ynet, mako)',
    example: 'ynet',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  provider: string;

  @ApiProperty({
    description: 'The RSS feed URL',
    example: 'http://www.ynet.co.il/Integration/StoryRss2.xml',
  })
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  url: string;

  @ApiProperty({
    description: 'Categories for the feed content',
    example: ['news', 'general'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  categories: string[];
}
