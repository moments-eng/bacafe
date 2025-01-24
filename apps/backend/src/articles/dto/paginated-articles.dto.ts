import { ApiProperty } from "@nestjs/swagger";
import { ArticleDto } from "./article.dto";

export class PaginatedArticlesDto {
	@ApiProperty({ type: [ArticleDto] })
	items: ArticleDto[];

	@ApiProperty()
	total: number;

	@ApiProperty()
	page: number;

	@ApiProperty()
	totalPages: number;

	@ApiProperty()
	hasNextPage: boolean;

	@ApiProperty()
	hasPreviousPage: boolean;
}
