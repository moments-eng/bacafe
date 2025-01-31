import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

export class ArticleImageDto {
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

export class ArticleUpdateBaseDto {
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
    description: 'Article description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Article author',
    required: false,
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({
    description: 'Article image information',
    required: false,
    type: ArticleImageDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ArticleImageDto)
  image?: ArticleImageDto;

  @ApiProperty({
    description: 'Article categories',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  categories?: string[];
}
