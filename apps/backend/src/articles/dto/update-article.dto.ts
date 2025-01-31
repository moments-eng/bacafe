import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleUpdateBaseDto } from './article-update.base.dto';

export class UpdateArticleImageDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  credit?: string;
}

export class UpdateArticleDto extends ArticleUpdateBaseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Article enrichment data',
    required: false,
    type: Object,
  })
  @IsOptional()
  @IsObject()
  enrichment?: Record<string, unknown>;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({ required: false, type: UpdateArticleImageDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateArticleImageDto)
  image?: UpdateArticleImageDto;
}
