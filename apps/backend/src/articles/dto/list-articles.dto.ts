import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class ListArticlesDto {
	@ApiPropertyOptional({
		description: "Page number (1-based)",
		default: 1,
		minimum: 1,
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@IsOptional()
	page?: number = 1;

	@ApiPropertyOptional({
		description: "Number of items per page",
		default: 10,
		minimum: 1,
		maximum: 50,
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(50)
	@IsOptional()
	limit?: number = 10;
}
