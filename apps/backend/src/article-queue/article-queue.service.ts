import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { extractErrorMessage } from 'src/utils/error';
import { QUEUE_NAMES, JOB_NAMES } from './constants';
import { ArticleQueueJobData } from './types/article-queue.types';

@Injectable()
export class ArticleQueueService {
  private readonly logger = new Logger(ArticleQueueService.name);

  constructor(
    @InjectQueue(QUEUE_NAMES.ARTICLE_SCRAPING)
    private readonly articleScrapingQueue: Queue<ArticleQueueJobData>,
  ) {}

  async queueArticleForScraping(articleId: string, url: string): Promise<void> {
    try {
      await this.articleScrapingQueue.add(JOB_NAMES.SCRAPE_ARTICLE, {
        articleId,
        url,
      });
      this.logger.log(`Added article ${articleId} to scraping queue`);
    } catch (error) {
      this.logger.error(`Failed to add article ${articleId} to scraping queue: ${extractErrorMessage(error)}`);
      throw error;
    }
  }
}
