import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ArticlesModule } from '../articles/articles.module';
import { FeedChannelModule } from '../feed-channel/feed-channel.module';
import { ArticleScrapingModule } from '../article-scraping/article-scraping.module';
import { FeedScrapingProcessor } from './feed-scraping.processor';
import { FeedScrapingService } from './feed-scraping.service';

@Module({
	imports: [
		BullModule.registerQueue({
			name: 'feed-scraping',
		}),
		ArticlesModule,
		FeedChannelModule,
		ArticleScrapingModule,
	],
	providers: [FeedScrapingService, FeedScrapingProcessor],
	exports: [FeedScrapingService],
})
export class FeedScrapingModule {}
