import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { extractErrorMessage } from 'src/utils/error';
import { BaseArticleScraper, ScrapedImage, ScrapingResult } from './base.scraper';

interface Now14JsonLdListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

interface Now14JsonLdBreadcrumbList {
  '@type': 'BreadcrumbList';
  itemListElement: Now14JsonLdListItem[];
}

interface Now14JsonLdAuthor {
  '@type': 'Person';
  name: string;
  url?: string;
  image?: string;
}

interface Now14JsonLdNewsArticle {
  '@context': string;
  '@type': 'NewsArticle';
  headline?: string;
  description?: string;
  image?: string;
  author?: Now14JsonLdAuthor;
  breadcrumbs?: Now14JsonLdBreadcrumbList;
}

@Injectable()
export class Now14Scraper extends BaseArticleScraper {
  private readonly logger = new Logger(Now14Scraper.name);

  readonly provider = 'now14';

  async scrape(url: string): Promise<ScrapingResult> {
    try {
      const html = await this.fetchPage(url);
      const $ = cheerio.load(html);

      // 1) Parse the JSON-LD data
      const jsonData = this.parseJsonLd($);

      // 2) Extract article body from the DOM
      const content = this.parseArticleContent($);

      // 3) Extract categories from JSON-LD breadcrumbs
      const categories = this.parseCategoriesFromJsonLd(jsonData);

      // 4) Extract image from JSON-LD or fallbacks
      const image = this.parseImage($, jsonData);

      // 5) Build result
      const result: ScrapingResult = {
        title: jsonData?.headline || this.parseTitleFallback($),
        subtitle: jsonData?.description || this.parseSubtitleFallback($),
        content,
        author: this.parseAuthor(jsonData),
        image,
        categories,
      };

      this.logger.debug(`Successfully scraped now14 article from ${url}`);
      return result;
    } catch (error: unknown) {
      this.logger.error(`Failed to scrape now14 article at ${url}: ${extractErrorMessage(error)}`);
      throw error;
    }
  }

  private parseJsonLd($: cheerio.CheerioAPI): Now14JsonLdNewsArticle | null {
    const scripts = $('script[type="application/ld+json"]');
    let newsArticleData: Now14JsonLdNewsArticle | null = null;

    scripts.each((_, scriptEl) => {
      try {
        const rawJson = $(scriptEl).html() || '';
        const parsed = JSON.parse(rawJson.trim()) as Now14JsonLdNewsArticle | Now14JsonLdNewsArticle[];

        // In some cases, it could be an array of objects
        const items = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of items) {
          // We only care about NewsArticle items
          if (item['@type'] === 'NewsArticle') {
            newsArticleData = item;
            this.logger.debug('Found valid NewsArticle JSON-LD data for now14');
            return false; // Cheerio's way to break out of .each
          }
        }
      } catch (e) {
        this.logger.warn(`Failed to parse JSON-LD script: ${extractErrorMessage(e)}`);
      }
    });

    if (!newsArticleData) {
      this.logger.debug('No valid NewsArticle data found in JSON-LD. Using fallback logic.');
      return null;
    }

    return newsArticleData;
  }

  private parseArticleContent($: cheerio.CheerioAPI): string {
    // From sample, paragraphs often live under .ArticleContent_articleContent__AdZEJ
    const paragraphs = $('.ArticleContent_articleContent__AdZEJ p');
    const content = paragraphs
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 0)
      .join('\n\n');

    return content;
  }

  private parseCategoriesFromJsonLd(jsonLd: Now14JsonLdNewsArticle | null): string[] {
    if (!jsonLd?.breadcrumbs) {
      return [];
    }

    const { itemListElement } = jsonLd.breadcrumbs;
    if (!Array.isArray(itemListElement)) {
      return [];
    }

    // For example: we might skip position=1 for homepage, or the last item if it's the article
    // But we'll simply return all that are not “דף הבית” and not the final item
    const categories = itemListElement
      .filter((it) => it.position !== 1 && it.name !== 'דף הבית')
      .filter((it) => it.position < itemListElement.length) // skip last one if it's the article title
      .map((it) => it.name.trim())
      .filter((name) => name.length > 0);

    return categories;
  }

  private parseImage($: cheerio.CheerioAPI, jsonLd: Now14JsonLdNewsArticle | null): ScrapedImage | undefined {
    // 1) Try from JSON-LD
    const jsonLdUrl = jsonLd?.image?.trim() || '';
    // 2) Try og:image
    const ogImage = $('meta[property="og:image"]').attr('content') || '';

    const finalUrl = jsonLdUrl || ogImage;
    if (!finalUrl) {
      return undefined;
    }

    // If the article has a figure with a figcaption for credit
    const figureCaption = $('figure.wp-caption.alignnone figcaption.wp-caption-text').text().trim();
    const credit = figureCaption.includes('צילום:') ? figureCaption : undefined;

    return { url: finalUrl, credit };
  }

  private parseAuthor(jsonLd: Now14JsonLdNewsArticle | null): string | undefined {
    // Try JSON-LD first
    if (jsonLd?.author && jsonLd.author.name) {
      return jsonLd.author.name.trim();
    }

    return undefined;
  }

  private parseTitleFallback($: cheerio.CheerioAPI): string {
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    if (ogTitle.trim()) {
      return ogTitle.trim();
    }

    const docTitle = $('title').first().text().trim();
    if (docTitle) {
      return docTitle;
    }

    const h1Title = $('h1').first().text().trim();
    return h1Title || 'Untitled now14 Article';
  }

  private parseSubtitleFallback($: cheerio.CheerioAPI): string {
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    if (metaDesc.trim()) {
      return metaDesc.trim();
    }

    const ogDesc = $('meta[property="og:description"]').attr('content') || '';
    if (ogDesc.trim()) {
      return ogDesc.trim();
    }

    // If there's an <h3> that might be the sub
    const h3Text = $('h3').first().text().trim();
    return h3Text || '';
  }
}
