import { ApiProperty } from '@nestjs/swagger';

export class FeedDto {
	@ApiProperty({ description: 'Feed ID' })
	id: string;

	@ApiProperty({ description: 'The name of the feed' })
	name: string;

	@ApiProperty({ description: 'The RSS feed URL' })
	url: string;

	@ApiProperty({ description: 'The news provider name' })
	provider: string;

	@ApiProperty({ description: 'The feed language' })
	language: string;

	@ApiProperty({ description: 'Whether the feed is active', default: true })
	isActive: boolean;

	@ApiProperty({ description: 'Feed categories', type: [String] })
	categories: string[];

	@ApiProperty({ description: 'Feed description', required: false })
	description?: string;

	@ApiProperty({ description: 'Scraping interval in minutes', default: 5 })
	scrapingInterval: number;

	@ApiProperty({ description: 'Last scraping timestamp' })
	lastScrapedAt?: Date;
}
