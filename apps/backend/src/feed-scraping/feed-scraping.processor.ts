import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import * as Parser from 'rss-parser';
import { ArticlesService } from '../articles/articles.service';
import { FeedChannelRepository } from '../feed-channel/feed-channel.repository';
import {
	FeedScrapingJobData,
	FeedScrapingResult,
} from './types/feed-scraping.types';
import { ArticleScrapingService } from '../article-scraping/article-scraping.service';

@Processor('feed-scraping')
export class FeedScrapingProcessor extends WorkerHost {
	private readonly logger = new Logger(FeedScrapingProcessor.name);
	private readonly parser = new Parser();

	constructor(
		private readonly articlesService: ArticlesService,
		private readonly feedChannelRepository: FeedChannelRepository,
		private readonly articleScrapingService: ArticleScrapingService,
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

				if (!(await this.articlesService.exists(externalId))) {
					const article = await this.articlesService.create({
						title: item.title,
						subtitle: item.contentSnippet || '',
						content: '',
						url: item.link || '',
						source: provider,
						publishedAt: new Date(item.pubDate || new Date()),
						externalId,
					});

					// Add the new article to the scraping queue
					await this.articleScrapingService.addArticleToScrapeQueue(
						article._id.toString(),
						article.url,
					);

					newArticles++;
				}
			}

			await this.feedChannelRepository.updateLastScrapedAt(feedId);
			this.logger.log(`Successfully scraped feed ${feedId}`);

			return {
				processedArticles,
				newArticles,
			};
		} catch (error) {
			this.logger.error(`Failed to scrape feed ${feedId}: ${error.message}`);
			throw error;
		}
	}
}
