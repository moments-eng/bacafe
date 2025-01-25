import { ApiProperty } from '@nestjs/swagger';
import { OnboardingDto } from './onboarding.dto';

export class PaginatedOnboardingDto {
  @ApiProperty({ type: [OnboardingDto] })
  items: OnboardingDto[];

  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Whether there is a next page' })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Whether there is a previous page' })
  hasPreviousPage: boolean;
}
