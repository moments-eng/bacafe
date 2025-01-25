import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class ArticlePositionDto {
  @ApiProperty({ description: 'Article ID', example: '507f1f77bcf86cd799439011' })
  articleId: string;

  @ApiProperty({ description: 'Position in the onboarding flow', example: 1 })
  position: number;
}

export class UpdateArticlePositionsDto {
  @ApiProperty({
    description: 'List of article positions to update',
    type: [ArticlePositionDto],
  })
  positions: ArticlePositionDto[];
}

export class AddArticleToOnboardingDto {
  @ApiProperty({
    description: 'Article ID to add',
    example: '507f1f77bcf86cd799439011',
  })
  articleId: string;

  @ApiProperty({
    description: 'Position in the onboarding flow',
    example: 1,
  })
  position: number;
}

export class UpdateArticlePositionDto {
  @ApiProperty({ description: 'New position in the onboarding flow', minimum: 1, example: 2 })
  @IsNumber()
  @Min(1)
  newPosition: number;
}
