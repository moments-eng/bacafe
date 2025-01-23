import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ArticlesModule } from '../articles/articles.module';
import { ArticleScrapingProcessor } from './article-scraping.processor';
import { ArticleScrapingService } from './article-scraping.service';
import { ScraperFactory } from './scrapers/scraper.factory';
import { YnetScraper } from './scrapers/ynet.scraper';
import { EnrichmentService } from './enrichment.service';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		BullModule.registerQueue({
			name: 'article-scraping',
		}),
		ArticlesModule,
		ConfigModule,
	],
	providers: [
		ArticleScrapingService,
		ArticleScrapingProcessor,
		ScraperFactory,
		YnetScraper,
		EnrichmentService,
	],
	exports: [ArticleScrapingService],
})
export class ArticleScrapingModule {}
