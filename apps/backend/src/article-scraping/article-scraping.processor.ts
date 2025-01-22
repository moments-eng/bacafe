import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ArticlesService } from '../articles/articles.service';
import {
	ArticleScrapingJobData,
	ArticleScrapingResult,
} from './types/article-scraping.types';
import { ScraperFactory } from './scrapers/scraper.factory';

@Processor('article-scraping')
export class ArticleScrapingProcessor extends WorkerHost {
	private readonly logger = new Logger(ArticleScrapingProcessor.name);

	constructor(
		private readonly articlesService: ArticlesService,
		private readonly scraperFactory: ScraperFactory,
	) {
		super();
	}

	async process(
		job: Job<ArticleScrapingJobData>,
	): Promise<ArticleScrapingResult> {
		const { articleId, url } = job.data;

		try {
			const article = await this.articlesService.findById(articleId);
			if (!article) {
				throw new Error(`Article not found: ${articleId}`);
			}

			const scraper = this.scraperFactory.getScraper(article.source);
			const scrapingResult = await scraper.scrape(url);

			await this.articlesService.update(articleId, {
				content: scrapingResult.content,
				author: scrapingResult.author,
				imageUrl: scrapingResult.imageUrl,
			});

			return {
				success: true,
				contentLength: scrapingResult.content.length,
			};
		} catch (error) {
			this.logger.error(
				`Failed to scrape article ${articleId}: ${error.message}`,
			);
			throw error;
		}
	}
}
