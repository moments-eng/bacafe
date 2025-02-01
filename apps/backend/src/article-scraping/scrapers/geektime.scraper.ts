import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { BaseArticleScraper, ScrapingResult } from './base.scraper';
import { extractErrorMessage } from 'src/utils/error';
import { GeektimeJsonLdParser } from '../parsers/geektime-json-ld.parser';

interface ParsedJsonLdData {
  title?: string;
  subtitle?: string;
  author?: string;
  image?: {
    url: string;
    credit?: string;
  };
  categories?: string[];
}

@Injectable()
export class GeektimeScraper extends BaseArticleScraper {
  readonly provider = 'geektime';
  private readonly logger = new Logger(GeektimeScraper.name);
  private readonly jsonLdParser = new GeektimeJsonLdParser();

  public async scrape(url: string): Promise<ScrapingResult> {
    try {
      const html = await this.fetchPage(url);
      const $ = cheerio.load(html);

      // Parse JSON-LD data
      const jsonLdData = this.parseJsonLd($);
      if (!jsonLdData) {
        this.logger.warn('No JSON-LD data found, falling back to HTML parsing');
      }

      // Combine JSON-LD data with HTML fallbacks
      const result: ScrapingResult = {
        title: this.parseTitle($, jsonLdData?.title),
        subtitle: this.parseSubtitle($, jsonLdData?.subtitle),
        content: this.parseContent($),
        author: jsonLdData?.author || this.parseAuthorFromHtml($),
        image: jsonLdData?.image || this.parseImageFromHtml($),
        categories: jsonLdData?.categories || this.parseCategoriesFromHtml($),
      };

      return result;
    } catch (error: unknown) {
      this.logger.error(`Failed to scrape Geektime article at ${url}: ${extractErrorMessage(error)}`);
      throw error;
    }
  }

  private parseJsonLd($: cheerio.CheerioAPI): ParsedJsonLdData | undefined {
    const scriptTags = $('script[type="application/ld+json"].yoast-schema-graph');
    let jsonLdData: ParsedJsonLdData | undefined;

    scriptTags.each((_i, el) => {
      try {
        const raw = $(el).html();
        if (!raw) return;

        const parsed = this.jsonLdParser.parseJsonLd(raw);
        if (parsed) {
          jsonLdData = parsed;
          return false; // break the loop
        }
      } catch (error) {
        this.logger.log(`Failed to parse JSON-LD data: ${extractErrorMessage(error)}`);
      }
    });

    return jsonLdData;
  }

  private parseTitle($: cheerio.CheerioAPI, jsonLdTitle?: string): string {
    if (jsonLdTitle) {
      return jsonLdTitle;
    }

    const ogTitle = $('meta[property="og:title"]').attr('content');
    if (ogTitle) {
      return ogTitle;
    }

    const docTitle = $('title').text().trim();
    if (docTitle) {
      return docTitle;
    }

    const h1 = $('h1').first().text().trim();
    if (h1) {
      return h1;
    }

    return 'Untitled';
  }

  private parseSubtitle($: cheerio.CheerioAPI, jsonLdSubtitle?: string): string {
    if (jsonLdSubtitle) {
      return jsonLdSubtitle;
    }

    const metaDesc = $('meta[name="description"]').attr('content');
    if (metaDesc) {
      return metaDesc;
    }

    const ogDesc = $('meta[property="og:description"]').attr('content');
    if (ogDesc) {
      return ogDesc;
    }

    const subTitle = $('p.head-sub-title').first().text().trim();
    if (subTitle) {
      return subTitle;
    }

    return '';
  }

  private parseContent($: cheerio.CheerioAPI): string {
    const elements = $('#content')
      .find('p, h2')
      .map((_i, el) => {
        const text = $(el).text().trim();
        return text ? text : null;
      })
      .get();

    return elements.join('\n\n');
  }

  private parseAuthorFromHtml($: cheerio.CheerioAPI): string | undefined {
    const metaAuthor = $('meta[name="author"]').attr('content');
    if (metaAuthor) {
      return metaAuthor;
    }

    const authorText = $('.info .author').first().text().trim();
    if (authorText) {
      return authorText;
    }

    return undefined;
  }

  private parseImageFromHtml($: cheerio.CheerioAPI) {
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (!ogImage) {
      return undefined;
    }

    const result = { url: ogImage };
    const figureCredit = $('#content figure figcaption, #content p.wp-caption-text').first().text().trim();

    if (figureCredit) {
      return { ...result, credit: figureCredit };
    }

    return result;
  }

  private parseCategoriesFromHtml($: cheerio.CheerioAPI): string[] {
    const categories: string[] = [];
    const catText = $('.card_meta_cats a.cat').first().text().replace(/[{}]/g, '').trim();

    if (catText) {
      categories.push(catText);
    }

    return categories;
  }
}
