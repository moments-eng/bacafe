import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString, IsUrl } from "class-validator";

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

	@ApiProperty({ required: false })
	imageUrl?: string;

	@ApiProperty({ type: [String], required: false })
	categories?: string[];
}
