import { ApiProperty } from '@nestjs/swagger';

export class ArticleStatsDto {
  @ApiProperty({ description: 'Total number of articles' })
  totalArticles: number;

  @ApiProperty({
    type: Object,
    description: 'Count of articles per provider/source',
    example: { ynet: 150, mako: 200 },
  })
  articlesPerProvider: Record<string, number>;

  @ApiProperty({
    type: [String],
    description: 'List of distinct providers/sources',
    example: ['ynet', 'mako'],
  })
  providers: string[];

  @ApiProperty({ description: 'Number of scraped articles' })
  scrapedCount: number;

  @ApiProperty({ description: 'Number of enriched articles' })
  enrichedCount: number;
}
