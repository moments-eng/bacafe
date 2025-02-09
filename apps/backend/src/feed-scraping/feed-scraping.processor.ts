import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import * as Parser from 'rss-parser';
import { extractErrorMessage } from 'src/utils/error';
import { ArticlesService } from '../articles/articles.service';
import { FeedChannelRepository } from '../feed-channel/feed-channel.repository';
import { FeedScrapingJobData, FeedScrapingResult } from './types/feed-scraping.types';

@Processor('feed-scraping')
export class FeedScrapingProcessor extends WorkerHost {
  private readonly logger = new Logger(FeedScrapingProcessor.name);
  private readonly parser = new Parser();

  constructor(
    private readonly articlesService: ArticlesService,
    private readonly feedChannelRepository: FeedChannelRepository,
  ) {
    super();
  }

  async process(job: Job<FeedScrapingJobData>): Promise<FeedScrapingResult> {
    const { feedId, url, provider } = job.data;
    let processedArticles = 0;
    let newArticles = 0;

    try {
      const feed = await this.parser.parseURL(url);

      for (const item of feed.items) {
        processedArticles++;
        const externalId = `${provider}-${item.guid || item.link}`;

        // Skip if article already exists
        if (await this.articlesService.exists(externalId)) {
          this.logger.debug(`Skipping existing article with externalId: ${externalId}`);
          continue;
        }

        // Create new article (queueing is handled by ArticlesService)
        await this.articlesService.create({
          url: item.link || '',
          source: provider,
          externalId,
        });
        newArticles++;
      }

      await this.feedChannelRepository.updateLastScrapedAt(feedId);
      this.logger.debug(`Successfully scraped feed ${feedId}: ${processedArticles} processed, ${newArticles} new`);

      return {
        processedArticles,
        newArticles,
      };
    } catch (error) {
      this.logger.error(`Failed to scrape feed ${feedId}: ${extractErrorMessage(error)}`);
      throw error;
    }
  }
}
