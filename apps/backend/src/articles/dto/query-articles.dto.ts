import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsObject, IsIn } from 'class-validator';

export class ArticleFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  subtitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  source?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  author?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  categories?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  publishedAtFrom?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  publishedAtTo?: Date;
}

export class ArticleSortDto {
  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  title?: 'asc' | 'desc';

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  publishedAt?: 'asc' | 'desc';

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  createdAt?: 'asc' | 'desc';
}

export class QueryArticlesDto {
  @ApiProperty({ required: false, type: ArticleFilterDto })
  @IsOptional()
  @IsObject()
  filter?: ArticleFilterDto;

  @ApiProperty({ required: false, type: ArticleSortDto })
  @IsOptional()
  @IsObject()
  sort?: ArticleSortDto;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;
}
