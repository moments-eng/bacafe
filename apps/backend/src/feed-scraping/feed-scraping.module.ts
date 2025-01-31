import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ArticleQueueModule } from '../article-queue/article-queue.module';
import { ArticlesModule } from '../articles/articles.module';
import { FeedChannelModule } from '../feed-channel/feed-channel.module';
import { FeedScrapingProcessor } from './feed-scraping.processor';
import { FeedScrapingService } from './feed-scraping.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'feed-scraping',
    }),
    ArticlesModule,
    FeedChannelModule,
    ArticleQueueModule,
  ],
  providers: [FeedScrapingService, FeedScrapingProcessor],
  exports: [FeedScrapingService],
})
export class FeedScrapingModule {}
