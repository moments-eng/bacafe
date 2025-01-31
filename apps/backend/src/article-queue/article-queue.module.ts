import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ArticleQueueService } from './article-queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'article-scraping',
    }),
  ],
  providers: [ArticleQueueService],
  exports: [ArticleQueueService],
})
export class ArticleQueueModule {}
