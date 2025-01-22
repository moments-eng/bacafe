import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue, RepeatOptions } from 'bullmq';
import { Types } from 'mongoose';
import { FeedChannel } from '../feeds/schemas/feed-channel.schema';
import {
	FeedScrapingJobData,
	FeedScrapingResult,
} from './types/feed-scraping.types';

@Injectable()
export class FeedScrapingService {
	private readonly logger = new Logger(FeedScrapingService.name);

	constructor(
		@InjectQueue('feed-scraping')
		private readonly feedScrapingQueue: Queue<
			FeedScrapingJobData,
			FeedScrapingResult
		>,
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
				`Scheduled recurring job for feed ${feed.name} (${feed._id}) every ${feed.scrapingInterval} minutes`,
			);
		} catch (error) {
			this.logger.error(
				`Failed to schedule recurring job for feed ${feed._id}: ${error.message}`,
			);
			throw error;
		}
	}

	async removeScheduledJob(feedId: string): Promise<void> {
		const schedulerId = this.getSchedulerId(feedId);

		try {
			const removed =
				await this.feedScrapingQueue.removeJobScheduler(schedulerId);
			if (removed) {
				this.logger.log(`Removed scheduler for feed ${feedId}`);
			}
		} catch (error) {
			this.logger.error(
				`Failed to remove scheduler for feed ${feedId}: ${error.message}`,
			);
			throw error;
		}
	}
}
