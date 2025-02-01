import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { BaseArticleScraper, ScrapedImage, ScrapingResult } from './base.scraper';
import { extractErrorMessage } from 'src/utils/error';

interface WallaJsonLdNewsArticle {
  '@type': string;
  headline?: string;
  description?: string;
  articleBody?: string;
  author?: {
    '@type': string;
    name: string;
  };
  image?: {
    '@type': string;
    url: string;
    caption?: string;
  };
  datePublished?: string;
  dateModified?: string;
  publisher?: {
    '@type': string;
    name: string;
  };
  breadcrumb?: {
    '@type': string;
    itemListElement: Array<{
      '@type': string;
      position: number;
      name: string;
      item?: string;
    }>;
  };
}

interface JsonLdData {
  '@type': string;
  [key: string]: unknown;
}

@Injectable()
export class WallaScraper extends BaseArticleScraper {
  private readonly logger = new Logger(WallaScraper.name);
  readonly provider = 'walla';

  async scrape(url: string): Promise<ScrapingResult> {
    try {
      const html = await this.fetchPage(url);
      const $ = cheerio.load(html);

      // Parse JSON-LD data first
      const jsonLd = this.parseJsonLd($);

      // Extract all required fields
      const title = this.parseTitle($, jsonLd);
      const subtitle = this.parseSubtitle($, jsonLd);
      const content = this.parseContent($, jsonLd);
      const author = this.parseAuthor($, jsonLd);
      const image = this.parseImage($, jsonLd);
      const categories = this.parseCategories($, jsonLd);

      return {
        title,
        subtitle,
        content,
        author,
        image,
        categories,
      };
    } catch (error: unknown) {
      this.logger.error(`Failed to scrape Walla article at ${url}: ${extractErrorMessage(error)}`);
      throw error;
    }
  }

  private parseJsonLd($: cheerio.CheerioAPI): WallaJsonLdNewsArticle | null {
    const scripts = $('script[type="application/ld+json"]');
    let newsArticle: WallaJsonLdNewsArticle | null = null;

    scripts.each((_, el) => {
      try {
        const raw = $(el).html() || '';
        const cleaned = raw.replace(/\/\*[\s\S]*?\*\//g, '').trim();
        if (!cleaned) return;

        const parsed = JSON.parse(cleaned) as JsonLdData | JsonLdData[];
        const items = Array.isArray(parsed) ? parsed : [parsed];

        for (const item of items) {
          if (item['@type'] === 'NewsArticle') {
            newsArticle = item as WallaJsonLdNewsArticle;
            this.logger.log('Found valid NewsArticle JSON-LD data');
            return false; // Break the loop
          }
        }
      } catch (error) {
        this.logger.warn(`Failed to parse JSON-LD script: ${extractErrorMessage(error)}`);
      }
    });

    return newsArticle;
  }

  private parseTitle($: cheerio.CheerioAPI, jsonLd: WallaJsonLdNewsArticle | null): string {
    // 1. Try JSON-LD headline
    if (jsonLd?.headline) {
      return jsonLd.headline.trim();
    }

    // 2. Try og:title
    const ogTitle = $('meta[property="og:title"]').attr('content');
    if (ogTitle) {
      return ogTitle.trim();
    }

    // 3. Try document title
    const docTitle = $('title').text();
    if (docTitle) {
      return docTitle.trim();
    }

    // 4. Try first h1
    const h1 = $('h1').first().text();
    if (h1) {
      return h1.trim();
    }

    return 'Untitled Walla Article';
  }

  private parseSubtitle($: cheerio.CheerioAPI, jsonLd: WallaJsonLdNewsArticle | null): string {
    // 1. Try JSON-LD description
    if (jsonLd?.description) {
      return jsonLd.description.trim();
    }

    // 2. Try meta description
    const metaDesc = $('meta[name="description"]').attr('content');
    if (metaDesc) {
      return metaDesc.trim();
    }

    // 3. Try og:description
    const ogDesc = $('meta[property="og:description"]').attr('content');
    if (ogDesc) {
      return ogDesc.trim();
    }

    // 4. Try first subtitle element
    const subtitle = $('.article-subtitle, h2').first().text();
    if (subtitle) {
      return subtitle.trim();
    }

    return '';
  }

  private parseContent($: cheerio.CheerioAPI, jsonLd: WallaJsonLdNewsArticle | null): string {
    // 1. Try JSON-LD articleBody
    if (jsonLd?.articleBody) {
      return jsonLd.articleBody.trim();
    }

    // 2. Try article content container
    const paragraphs = $('.article-content p, [class*="ArticleContent"] p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((text) => text.length > 0);

    if (paragraphs.length > 0) {
      return paragraphs.join('\n\n');
    }

    // 3. Fallback to any paragraphs in the main content area
    const fallbackParagraphs = $('main p, article p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((text) => text.length > 0);

    return fallbackParagraphs.join('\n\n');
  }

  private parseAuthor($: cheerio.CheerioAPI, jsonLd: WallaJsonLdNewsArticle | null): string | undefined {
    // 1. Try JSON-LD author
    if (jsonLd?.author?.name) {
      return jsonLd.author.name.trim();
    }

    // 2. Try meta author
    const metaAuthor = $('meta[name="author"]').attr('content');
    if (metaAuthor) {
      return metaAuthor.trim();
    }

    // 3. Try article:author meta
    const articleAuthor = $('meta[property="article:author"]').attr('content');
    if (articleAuthor) {
      return articleAuthor.trim();
    }

    // 4. Try author link
    const authorLink = $('a[href*="/writer/"]').first().text();
    if (authorLink) {
      return authorLink.trim();
    }

    return undefined;
  }

  private parseImage($: cheerio.CheerioAPI, jsonLd: WallaJsonLdNewsArticle | null): ScrapedImage | undefined {
    // 1. Try JSON-LD image
    if (jsonLd?.image?.url) {
      return {
        url: jsonLd.image.url,
        credit: jsonLd.image.caption,
      };
    }

    // 2. Try og:image
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (!ogImage) {
      return undefined;
    }

    const result: ScrapedImage = { url: ogImage };

    // Try to find image credit
    const figureCredit = $('figure figcaption')
      .filter((_, el) => {
        const text = $(el).text().trim();
        return text.includes('צילום:') || text.includes('צלם:');
      })
      .first()
      .text()
      .trim();

    if (figureCredit) {
      result.credit = figureCredit;
    }

    return result;
  }

  private parseCategories($: cheerio.CheerioAPI, jsonLd: WallaJsonLdNewsArticle | null): string[] {
    // 1. Try JSON-LD breadcrumb
    if (jsonLd?.breadcrumb?.itemListElement) {
      return jsonLd.breadcrumb.itemListElement
        .filter((item) => item.name !== 'ראשי' && item.name !== 'בית')
        .map((item) => item.name.trim())
        .filter((name) => name.length > 0);
    }

    // 2. Try breadcrumb elements in the DOM
    const breadcrumbs = $('.breadcrumbs a')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((text) => text !== 'ראשי' && text !== 'בית' && text.length > 0);

    if (breadcrumbs.length > 0) {
      return breadcrumbs;
    }

    // 3. Try category links
    const categories = $('.article-category a, .category-label')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((text) => text.length > 0);

    return categories;
  }
}
