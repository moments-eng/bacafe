import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, IsUrl } from "class-validator";

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

	@ApiProperty({ required: false })
	@IsOptional()
	@IsUrl()
	imageUrl?: string;
}
