import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { BaseArticleScraper, ScrapingResult, ScrapedImage } from './base.scraper';
import { extractErrorMessage } from 'src/utils/error';

interface BreadcrumbItem {
  '@type'?: string;
  position?: number;
  name?: string;
  item?: string;
}

interface JsonLdBreadcrumbList {
  '@type'?: string;
  itemListElement?: BreadcrumbItem[];
}

interface JsonLdAuthor {
  '@type'?: string;
  name?: string;
  url?: string;
}

interface JsonLdNewsArticle {
  '@type'?: string;
  headline?: string;
  description?: string;
  articleBody?: string;
  author?: JsonLdAuthor | JsonLdAuthor[];
  image?: string;
  datePublished?: string;
  dateModified?: string;
  mainEntityOfPage?: {
    '@type'?: string;
    '@id'?: string;
  };
  publisher?: {
    '@type'?: string;
    name?: string;
    logo?: {
      '@type'?: string;
      url?: string;
      width?: number;
      height?: number;
    };
  };
}

@Injectable()
export class I24NewsScraper extends BaseArticleScraper {
  readonly provider = 'i24news';
  private readonly logger = new Logger(I24NewsScraper.name);

  public async scrape(url: string): Promise<ScrapingResult> {
    try {
      const html = await this.fetchPage(url);
      const $ = cheerio.load(html);

      const { articleJson, breadcrumbJson } = this.parseJsonLd($);
      const title = this.parseTitle($, articleJson);
      const subtitle = this.parseSubtitle($, articleJson);
      const content = this.parseContent($, articleJson);
      const author = this.parseAuthor($, articleJson);
      const image = this.parseImage($, articleJson);
      const categories = this.parseCategories(breadcrumbJson);

      const result: ScrapingResult = {
        title,
        subtitle,
        content,
        author: author ? author.trim() : undefined,
        image,
        categories,
      };

      return result;
    } catch (error: unknown) {
      this.logger.error(`Failed to scrape i24news article at ${url}: ${extractErrorMessage(error)}`);
      throw error;
    }
  }

  private parseJsonLd($: cheerio.CheerioAPI): {
    articleJson?: JsonLdNewsArticle;
    breadcrumbJson?: JsonLdBreadcrumbList;
  } {
    const scripts = $('script[type="application/ld+json"]');
    let articleJson: JsonLdNewsArticle | undefined;
    let breadcrumbJson: JsonLdBreadcrumbList | undefined;

    scripts.each((_i, el) => {
      try {
        const raw = $(el).html() || '';
        const cleaned = raw.replace(/\/\*.*?\*\//g, '');
        const data = JSON.parse(cleaned) as JsonLdNewsArticle | JsonLdNewsArticle[] | JsonLdBreadcrumbList;
        const items = Array.isArray(data) ? data : [data];

        for (const item of items) {
          if (item['@type'] === 'NewsArticle') {
            // Prefer the first valid NewsArticle we find
            if (!articleJson) articleJson = item as JsonLdNewsArticle;
          }
          if (item['@type'] === 'BreadcrumbList') {
            breadcrumbJson = item as JsonLdBreadcrumbList;
          }
        }
      } catch {
        // silently skip JSON-LD parse errors
      }
    });

    return { articleJson, breadcrumbJson };
  }

  private parseTitle($: cheerio.CheerioAPI, json?: JsonLdNewsArticle): string {
    if (json?.headline) {
      return json.headline;
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

  private parseSubtitle($: cheerio.CheerioAPI, json?: JsonLdNewsArticle): string {
    if (json?.description) {
      return json.description;
    }
    const metaDesc = $('meta[name="description"]').attr('content');
    if (metaDesc) {
      return metaDesc;
    }
    const ogDesc = $('meta[property="og:description"]').attr('content');
    if (ogDesc) {
      return ogDesc;
    }
    const h3 = $('h3').first().text().trim();
    if (h3) {
      return h3;
    }
    return '';
  }

  private parseContent($: cheerio.CheerioAPI, json?: JsonLdNewsArticle): string {
    if (json?.articleBody) {
      return json.articleBody;
    }
    // Fallback: gather all paragraphs from a container with partial match.
    const paragraphs = $('[class*="components"] p')
      .map((_i, el) => {
        const text = $(el).text().trim();
        return text ? text : null;
      })
      .get();
    return paragraphs.join('\n\n');
  }

  private parseAuthor($: cheerio.CheerioAPI, json?: JsonLdNewsArticle): string | undefined {
    // JSON-LD
    if (json?.author) {
      // author can be single or array
      if (Array.isArray(json.author)) {
        const first = json.author.find((a) => a.name);
        if (first?.name) {
          return first.name;
        }
      } else if (json.author.name) {
        return json.author.name;
      }
    }
    // Fallback meta
    const metaAuthor = $('meta[name="author"]').attr('content');
    if (metaAuthor && metaAuthor.trim()) {
      return metaAuthor;
    }
    // Fallback link to /author/
    const authorLink = $('a[href*="/author/"]').first().text().trim();
    if (authorLink) {
      return authorLink;
    }
    return undefined;
  }

  private parseImage($: cheerio.CheerioAPI, json?: JsonLdNewsArticle): ScrapedImage | undefined {
    // JSON-LD
    const imageUrl = json?.image;
    if (imageUrl) {
      return { url: imageUrl };
    }
    // Fallback: og:image
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (!ogImage) {
      return undefined;
    }

    const result: ScrapedImage = { url: ogImage };

    // Check for figure + figcaption credit
    // If there's a <span class="credit">something</span>, we can use that as a fallback credit
    const figureCredit = $('figure figcaption span.credit').first().text().trim();
    if (figureCredit) {
      result.credit = figureCredit;
    }

    return result;
  }

  private parseCategories(breadcrumbJson?: JsonLdBreadcrumbList): string[] {
    if (!breadcrumbJson?.itemListElement) {
      return [];
    }
    const items = breadcrumbJson.itemListElement;
    // Exclude "Home"/"דף הבית"/"i24NEWS" and the final item if it’s the article
    if (items.length <= 1) {
      return [];
    }
    const filtered = items.filter((entry, idx) => {
      if (!entry.name) return false;
      const isLast = idx === items.length - 1;
      const nameLower = entry.name.trim().toLowerCase();
      const skipHome = nameLower === 'home' || nameLower === 'דף הבית' || nameLower === 'i24news';

      return !skipHome && !isLast;
    });
    const categories = filtered.map((entry) => entry.name || '').map((c) => c.trim());
    return categories;
  }
}
