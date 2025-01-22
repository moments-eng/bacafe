import { Injectable, Logger } from '@nestjs/common';
import * as Parser from 'rss-parser';
import { FeedChannelRepository } from '../feed-channel/feed-channel.repository';
import { FeedScrapingService } from '../feed-scraping/feed-scraping.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { FeedChannel } from './schemas/feed-channel.schema';

@Injectable()
export class FeedsService {
	private readonly logger = new Logger(FeedsService.name);

	constructor(
		private readonly feedChannelRepository: FeedChannelRepository,
		private readonly feedScrapingService: FeedScrapingService,
	) {}

	async findAll(): Promise<FeedChannel[]> {
		return this.feedChannelRepository.findAll();
	}

	async findByProvider(provider: string): Promise<FeedChannel[]> {
		return this.feedChannelRepository.findByProvider(provider);
	}

	async updateLastScrapedAt(id: string): Promise<void> {
		await this.feedChannelRepository.updateLastScrapedAt(id);
	}

	async findDueForScraping(): Promise<FeedChannel[]> {
		return this.feedChannelRepository.findDueForScraping();
	}

	async createFromRss(createFeedDto: CreateFeedDto): Promise<FeedChannel> {
		try {
			const parser = new Parser();
			const feed = await parser.parseURL(createFeedDto.url);

			const feedChannel: Partial<FeedChannel> = {
				name: feed.title || 'Unnamed Feed',
				url: createFeedDto.url,
				provider: createFeedDto.provider,
				language: feed.language || 'he',
				categories: createFeedDto.categories,
				isActive: false,
				scrapingInterval: -1,
				description: feed.description,
			};

			return await this.feedChannelRepository.upsertByUrl(
				createFeedDto.url,
				feedChannel,
			);
		} catch (error) {
			this.logger.error(`Failed to parse RSS feed: ${error.message}`);
			throw error;
		}
	}

	async updateFeedStatus(
		id: string,
		isActive: boolean,
		scrapingInterval?: number,
	): Promise<FeedChannel> {
		const updated = await this.feedChannelRepository.updateFeedStatus(
			id,
			isActive,
			scrapingInterval,
		);

		try {
			if (updated.isActive && updated.scrapingInterval > 0) {
				await this.feedScrapingService.scheduleRecurringJob(updated);
			} else {
				await this.feedScrapingService.removeScheduledJob(id);
			}
		} catch (error) {
			this.logger.error(
				`Failed to manage job scheduler for feed ${id}: ${error.message}`,
			);
			throw error;
		}

		return updated;
	}

	async findById(id: string): Promise<FeedChannel> {
		return this.feedChannelRepository.findById(id);
	}

	async delete(id: string): Promise<void> {
		await this.feedChannelRepository.delete(id);
	}
}
