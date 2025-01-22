import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ArticlesModule } from '../articles/articles.module';
import { ArticleScrapingProcessor } from './article-scraping.processor';
import { ArticleScrapingService } from './article-scraping.service';
import { ScraperFactory } from './scrapers/scraper.factory';
import { YnetScraper } from './scrapers/ynet.scraper';

@Module({
	imports: [
		BullModule.registerQueue({
			name: 'article-scraping',
		}),
		ArticlesModule,
	],
	providers: [
		ArticleScrapingService,
		ArticleScrapingProcessor,
		ScraperFactory,
		YnetScraper,
	],
	exports: [ArticleScrapingService],
})
export class ArticleScrapingModule {}
