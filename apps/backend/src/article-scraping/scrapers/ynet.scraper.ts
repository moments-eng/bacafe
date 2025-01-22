import * as cheerio from 'cheerio';
import { Injectable, Logger } from '@nestjs/common';
import { BaseArticleScraper, ScrapingResult } from './base.scraper';
import { YNET_CONFIG } from './config/scraper.config';

@Injectable()
export class YnetScraper extends BaseArticleScraper {
	private readonly logger = new Logger(YnetScraper.name);
	readonly provider = 'ynet';

	async scrape(url: string): Promise<ScrapingResult> {
		try {
			const html = await this.fetchPage(url);
			const $ = cheerio.load(html);
			const { selectors } = YNET_CONFIG;

			// Get main content elements
			const mainTitle = $(selectors.articleMainTitle).text().trim();
			const subTitle = $(selectors.articleSubTitle).text().trim();
			const paragraphs: string[] = [];

			// Extract all paragraphs
			$(selectors.articleParagraph).each((_, element) => {
				const text = $(element).text().trim();
				if (text) {
					paragraphs.push(text);
				}
			});

			// Combine paragraphs into full content
			const content = paragraphs.join('\n\n');

			// If no content was found, throw an error
			if (!content) {
				throw new Error('No content found in article');
			}

			this.logger.debug(
				`Successfully scraped article from ${url} (${content.length} chars)`,
			);

			return {
				content,
				author: undefined, // Ynet doesn't have consistent author formatting
				imageUrl: undefined, // We can add image scraping later if needed
			};
		} catch (error) {
			this.logger.error(
				`Failed to scrape Ynet article at ${url}: ${error.message}`,
			);
			throw error;
		}
	}
}
