import { Module } from '@nestjs/common';
import { FeedChannelModule } from '../feed-channel/feed-channel.module';
import { FeedScrapingModule } from '../feed-scraping/feed-scraping.module';
import { FeedsController } from './feeds.controller';
import { FeedsService } from './feeds.service';

@Module({
  imports: [FeedChannelModule, FeedScrapingModule],
  controllers: [FeedsController],
  providers: [FeedsService],
  exports: [FeedsService],
})
export class FeedsModule {}
