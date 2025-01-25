import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsString, ValidateNested } from 'class-validator';

export class OnboardingArticleDto {
  @ApiProperty({ description: 'Article ID', example: '507f1f77bcf86cd799439011' })
  @IsString()
  articleId: string;

  @ApiProperty({ description: 'Position in onboarding flow', minimum: 1, example: 1 })
  position: number;
}

export class CreateOnboardingDto {
  @ApiProperty({
    description: 'Articles with their positions in the onboarding flow',
    type: [OnboardingArticleDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  articles: OnboardingArticleDto[];
}
