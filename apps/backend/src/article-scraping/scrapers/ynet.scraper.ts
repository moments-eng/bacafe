import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { extractErrorMessage } from 'src/utils/error';
import { BaseArticleScraper, ScrapingResult } from './base.scraper';

interface YnetNewsArticle {
  '@type': string;
  headline: string;
  description: string;
  articleBody: string;
  author?: {
    '@type': string;
    name: string;
  };
}

interface JsonLdNewsArticle {
  '@type': string;
  headline: string;
  description: string;
  articleBody: string;
  author?: {
    '@type': string;
    name: string;
  };
}

@Injectable()
export class YnetScraper extends BaseArticleScraper {
  private readonly logger = new Logger(YnetScraper.name);
  readonly provider = 'ynet';

  async scrape(url: string): Promise<ScrapingResult> {
    try {
      const html = await this.fetchPage(url);
      const $ = cheerio.load(html);
      const jsonData = this.parseJsonLd($);

      if (!jsonData?.articleBody) {
        throw new Error('No valid article content found in JSON-LD data');
      }

      const imageUrl = $('meta[property="vr:image"]').attr('content');
      const imageCredit = $('meta[property="vr:image_credit"]').attr('content');

      this.logger.debug(`Successfully scraped article from ${url} (${jsonData.articleBody.length} chars)`);

      return {
        content: jsonData.articleBody,
        author: this.parseAuthor(jsonData.author),
        image: imageUrl ? { url: imageUrl, credit: imageCredit } : undefined,
      };
    } catch (error: unknown) {
      this.logger.error(`Failed to scrape Ynet article at ${url}: ${extractErrorMessage(error)}`);
      throw error;
    }
  }

  private parseJsonLd($: cheerio.CheerioAPI): YnetNewsArticle {
    const jsonScripts = $('script[type="application/ld+json"]');
    let newsArticleData: YnetNewsArticle | null = null;

    jsonScripts.each((_, script) => {
      try {
        const jsonStr =
          $(script)
            .html()
            ?.replace(/\/\*.*?\*\//g, '') || '';
        const data = JSON.parse(jsonStr) as JsonLdNewsArticle | JsonLdNewsArticle[];
        const articles = Array.isArray(data) ? data : [data];

        for (const item of articles) {
          if (item['@type'] === 'NewsArticle') {
            newsArticleData = {
              '@type': item['@type'],
              headline: item.headline,
              description: item.description,
              articleBody: item.articleBody,
              author: item.author,
            };
            this.logger.debug('Found valid NewsArticle JSON-LD data');
            return false; // Break Cheerio loop
          }
        }
      } catch (e) {
        this.logger.warn(`Failed to parse JSON-LD script: ${extractErrorMessage(e)}`);
      }
    });

    if (!newsArticleData) {
      throw new Error('No valid NewsArticle data found in JSON-LD scripts');
    }
    return newsArticleData;
  }

  private parseAuthor(authorData: YnetNewsArticle['author']): string | undefined {
    if (!authorData) {
      this.logger.debug('No author information found in JSON-LD');
      return undefined;
    }

    if (authorData['@type'] === 'Person') {
      return authorData.name;
    }

    return undefined;
  }
}
