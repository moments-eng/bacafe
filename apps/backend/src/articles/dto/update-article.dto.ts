import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateArticleImageDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  credit?: string;
}

export class UpdateArticleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
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
