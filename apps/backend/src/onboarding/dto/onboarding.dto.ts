import { ApiProperty } from '@nestjs/swagger';
import { ArticleDto } from '../../articles/dto/article.dto';
import { ArticleWithPosition, Onboarding } from '../schemas/onboarding.schema';
import type { Document } from 'mongoose';
import type { Article } from '../../articles/schemas/article.schema';

export class OnboardingArticlePositionDto {
  @ApiProperty({ type: ArticleDto, description: 'The article in the onboarding flow' })
  article: ArticleDto;

  @ApiProperty({ description: 'Position of the article in the onboarding flow', example: 1 })
  position: number;
}

export class OnboardingDto {
  @ApiProperty({ description: 'Onboarding ID' })
  id: string;

  @ApiProperty({
    description: 'Articles with their positions in the onboarding flow',
    isArray: true,
    type: OnboardingArticlePositionDto,
  })
  articles: OnboardingArticlePositionDto[];

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updatedAt: Date;

  @ApiProperty({ description: 'Whether this is the production version' })
  isProduction: boolean;

  static fromSchema(schema: Document<unknown, any, Onboarding> & Onboarding): OnboardingDto {
    return {
      id: schema._id.toString(),
      articles: schema.articles.map((a) => ({
        article: ArticleDto.fromSchema(a.article as Article),
        position: a.position,
      })),
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      isProduction: schema.isProduction,
    };
  }
}
