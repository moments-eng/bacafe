import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsUrl, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArticleImageDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  credit?: string;
}

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  subtitle: string;

  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsString()
  source: string;

  @ApiProperty()
  @IsDate()
  publishedAt: Date;

  @ApiProperty()
  @IsString()
  externalId: string;

  @ApiProperty({ required: false })
  content?: string;

  @ApiProperty({ required: false })
  author?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false, type: CreateArticleImageDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateArticleImageDto)
  image?: CreateArticleImageDto;

  @ApiProperty({ type: [String], required: false })
  categories?: string[];
}
