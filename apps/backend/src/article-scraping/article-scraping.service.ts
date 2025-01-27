import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ArticleScrapingJobData, ArticleScrapingResult } from './types/article-scraping.types';
import { extractErrorMessage } from 'src/utils/error';

@Injectable()
export class ArticleScrapingService {
  private readonly logger = new Logger(ArticleScrapingService.name);

  constructor(
    @InjectQueue('article-scraping')
    private readonly articleScrapingQueue: Queue<ArticleScrapingJobData, ArticleScrapingResult>,
  ) {}

  async addArticleToScrapeQueue(articleId: string, url: string): Promise<void> {
    try {
      await this.articleScrapingQueue.add('scrape-article', {
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
