import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ArticleScrapingStatus } from '../schemas/article.schema';
import { CreateArticleImageDto } from './create-article.dto';
import { ArticleUpdateBaseDto } from './article-update.base.dto';

export class UpdateScrapingResultDto extends ArticleUpdateBaseDto {
  @ApiProperty({
    description: 'The scraped title of the article',
    example: 'Breaking News: Important Event',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The scraped subtitle/description of the article',
    example: 'Detailed subtitle about the important event',
  })
  @IsString()
  subtitle: string;

  @ApiProperty({
    description: 'The scraped content of the article',
    example: 'Full article content...',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The author of the article',
    required: false,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({
    description: 'The publication date of the article',
    example: '2024-03-20T12:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  publishedAt: Date;

  @ApiProperty({
    description: 'The scraped image information',
    required: false,
    type: CreateArticleImageDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateArticleImageDto)
  image?: CreateArticleImageDto;

  @ApiProperty({
    description: 'The scraping status of the article',
    enum: ArticleScrapingStatus,
    example: ArticleScrapingStatus.COMPLETED,
  })
  @IsEnum(ArticleScrapingStatus)
  scrapingStatus: ArticleScrapingStatus;

  @ApiProperty({
    description: 'Error message if scraping failed',
    required: false,
    example: 'Failed to access article content',
  })
  @IsOptional()
  @IsString()
  scrapingError?: string;
}
