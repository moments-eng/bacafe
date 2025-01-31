import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUrl, IsOptional, ValidateNested, Matches, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArticleImageDto {
  @ApiProperty({
    description: 'URL of the article image',
    example: 'https://example.com/image.jpg',
  })
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'Image credit/attribution',
    required: false,
    example: '© 2024 Example Photography',
  })
  @IsOptional()
  @IsString()
  credit?: string;
}

export class CreateArticleDto {
  @ApiProperty({
    description: 'The URL of the article to scrape',
    example: 'https://example.com/article',
  })
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  url: string;

  @ApiProperty({
    description: 'The source/provider of the article',
    example: 'ynet',
  })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Source must contain only lowercase letters, numbers, and hyphens',
  })
  source: string;

  @ApiProperty({
    description: 'Optional external ID for the article',
    required: false,
    example: 'ynet-123456',
  })
  @IsOptional()
  @IsString()
  externalId?: string;

  @ApiProperty({
    description: 'Whether to force rescraping if the article already exists',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  forceScrape?: boolean;

  @ApiProperty({
    description: 'Article title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Article subtitle',
    required: false,
  })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({
    description: 'Article content',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Article author',
    required: false,
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({
    description: 'Article description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Publication date',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publishedAt?: Date;

  @ApiProperty({
    description: 'Article image',
    required: false,
    type: CreateArticleImageDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateArticleImageDto)
  image?: CreateArticleImageDto;

  @ApiProperty({
    description: 'Article categories',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  categories?: string[];
}
