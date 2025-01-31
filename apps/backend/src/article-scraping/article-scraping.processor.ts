import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { extractErrorMessage } from 'src/utils/error';
import { QUEUE_NAMES } from '../article-queue/constants';
import { ArticleQueueJobData, ArticleQueueResult } from '../article-queue/types/article-queue.types';
import { ArticlesService } from '../articles/articles.service';
import { EnrichmentService } from './enrichment.service';
import { ScraperFactory } from './scrapers/scraper.factory';

@Processor(QUEUE_NAMES.ARTICLE_SCRAPING)
export class ArticleScrapingProcessor extends WorkerHost {
  private readonly logger = new Logger(ArticleScrapingProcessor.name);

  constructor(
    private readonly articlesService: ArticlesService,
    private readonly scraperFactory: ScraperFactory,
    private readonly enrichmentService: EnrichmentService,
  ) {
    super();
  }

  async process(job: Job<ArticleQueueJobData>): Promise<ArticleQueueResult> {
    const { articleId, url } = job.data;

    try {
      const article = await this.articlesService.findById(articleId);
      if (!article) {
        throw new Error(`Article not found: ${articleId}`);
      }

      const scraper = this.scraperFactory.getScraper(article.source);
      const scrapingResult = await scraper.scrape(url);

      // Update article with scraped content
      await this.articlesService.update(articleId, {
        title: scrapingResult.title,
        subtitle: scrapingResult.subtitle,
        content: scrapingResult.content,
        author: scrapingResult.author,
        image: scrapingResult.image,
      });

      if (scrapingResult.title && scrapingResult.subtitle && scrapingResult.content) {
        const enrichmentData = await this.enrichmentService.enrichArticle({
          title: scrapingResult.title,
          subtitle: scrapingResult.subtitle,
          content: scrapingResult.content,
        });

        const { embeddings, ...rest } = enrichmentData;
        await this.articlesService.update(articleId, {
          enrichment: rest,
          embeddings: embeddings as number[],
        });
      } else {
        this.logger.warn(`Skipping enrichment for article ${articleId} due to missing data`, {
          article,
          scrapingResult,
        });
      }

      return {
        success: true,
        contentLength: scrapingResult.content.length,
      };
    } catch (error) {
      this.logger.error(`Failed to scrape article ${articleId}: ${extractErrorMessage(error)}`);
      throw error;
    }
  }
}
