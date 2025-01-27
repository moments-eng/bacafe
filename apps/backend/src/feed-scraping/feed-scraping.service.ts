import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue, RepeatOptions } from 'bullmq';
import { Types } from 'mongoose';
import { extractErrorMessage } from 'src/utils/error';
import { FeedChannel } from '../feeds/schemas/feed-channel.schema';
import { FeedScrapingJobData, FeedScrapingResult } from './types/feed-scraping.types';

@Injectable()
export class FeedScrapingService {
  private readonly logger = new Logger(FeedScrapingService.name);

  constructor(
    @InjectQueue('feed-scraping')
    private readonly feedScrapingQueue: Queue<FeedScrapingJobData, FeedScrapingResult>,
  ) {}

  private getSchedulerId(feedId: Types.ObjectId | string): string {
    return `feed-scheduler:${feedId.toString()}`;
  }

  async scheduleRecurringJob(feed: FeedChannel): Promise<void> {
    const schedulerId = this.getSchedulerId(feed._id);
    const jobData: FeedScrapingJobData = {
      feedId: feed._id.toString(),
      url: feed.url,
      provider: feed.provider,
    };

    try {
      const repeatOpts: Omit<RepeatOptions, 'key'> = {
        pattern: `*/${feed.scrapingInterval} * * * *`, // Convert minutes to cron pattern
      };

      await this.feedScrapingQueue.upsertJobScheduler(schedulerId, repeatOpts, {
        name: 'scrape-feed',
        data: jobData,
      });

      this.logger.log(
        `Scheduled recurring job for feed ${feed.name} (${feed._id.toString()}) every ${feed.scrapingInterval} minutes`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to schedule recurring job for feed ${feed._id.toString()}: ${extractErrorMessage(error)}`,
      );
      throw error;
    }
  }

  async removeScheduledJob(feedId: string): Promise<void> {
    const schedulerId = this.getSchedulerId(feedId);

    try {
      const removed = await this.feedScrapingQueue.removeJobScheduler(schedulerId);
      if (removed) {
        this.logger.log(`Removed scheduler for feed ${feedId}`);
      }
    } catch (error) {
      this.logger.error(`Failed to remove scheduler for feed ${feedId}: ${extractErrorMessage(error)}`);
      throw error;
    }
  }

  async triggerImmediateScrape(feed: FeedChannel): Promise<void> {
    const jobData: FeedScrapingJobData = {
      feedId: feed._id.toString(),
      url: feed.url,
      provider: feed.provider,
    };

    try {
      await this.feedScrapingQueue.add('scrape-feed-immediate', jobData, {
        priority: 1,
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      });
      this.logger.log(`Triggered immediate scrape for feed ${feed.name} (${feed._id.toString()})`);
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      this.logger.error(`Failed to trigger immediate scrape for feed ${feed._id.toString()}: ${message}`);
      throw new Error('Failed to queue scraping job');
    }
  }
}
