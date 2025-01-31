import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from 'src/articles/articles.module';
import { QUEUE_NAMES } from '../article-queue/constants';
import { ArticleScrapingProcessor } from './article-scraping.processor';
import { EnrichmentService } from './enrichment.service';
import { CalcalistScraper } from './scrapers/calcalist.scraper';
import { GeektimeScraper } from './scrapers/geektime.scraper';
import { I24NewsScraper } from './scrapers/i24news.scraper';
import { Now14Scraper } from './scrapers/now14.scraper';
import { ScraperFactory } from './scrapers/scraper.factory';
import { WallaScraper } from './scrapers/walla.scraper';
import { YnetScraper } from './scrapers/ynet.scraper';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAMES.ARTICLE_SCRAPING,
    }),
    ConfigModule,
    ArticlesModule,
  ],
  providers: [
    ArticleScrapingProcessor,
    ScraperFactory,
    YnetScraper,
    EnrichmentService,
    GeektimeScraper,
    CalcalistScraper,
    I24NewsScraper,
    Now14Scraper,
    WallaScraper,
  ],
})
export class ArticleScrapingModule {}
