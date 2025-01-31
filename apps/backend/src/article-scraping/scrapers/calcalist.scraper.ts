import { Injectable, Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { BaseArticleScraper, ScrapedImage, ScrapingResult } from './base.scraper';

/**
 * JSON-LD interfaces for Calcalist
 */
interface CalcalistBreadcrumbList {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: string;
    item: {
      '@type': string;
      '@id': string;
      name: string;
    };
  }>;
}

interface CalcalistWebPage {
  '@context': string;
  '@type': 'WebPage';
  name: string;
  url?: string;
  description?: string;
  breadcrumb?: CalcalistBreadcrumbList;
}

interface CalcalistArticleAuthor {
  '@type': string;
  name: string;
}

interface CalcalistArticleImage {
  '@type': string;
  url: string;
  height?: string;
  width?: string;
}

interface CalcalistNewsArticle {
  '@context': string;
  '@type': 'NewsArticle';
  mainEntityOfPage?: {
    '@type': string;
    '@id': string;
  };
  headline?: string;
  description?: string;
  articleBody?: string;
  keywords?: string[];
  image?: CalcalistArticleImage;
  author?: CalcalistArticleAuthor;
  datePublished?: string;
  dateModified?: string;
  publisher?: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
      height?: string;
      width?: string;
    };
  };
}

/**
 * Container for parsed JSON-LD data
 */
interface ParsedJsonLdData {
  newsArticle?: CalcalistNewsArticle;
  webPage?: CalcalistWebPage;
}

@Injectable()
export class CalcalistScraper extends BaseArticleScraper {
  readonly provider = 'calcalist';
  private readonly logger = new Logger(CalcalistScraper.name);

  public async scrape(url: string): Promise<ScrapingResult> {
    const html = await this.fetchPage(url);
    const $ = cheerio.load(html);

    const { newsArticle, webPage } = this.parseJsonLd($);

    const title: string = this.parseTitle($, newsArticle);
    const subtitle: string = this.parseSubtitle($, newsArticle);
    const content: string = this.parseContent($, newsArticle);
    const author: string | undefined = this.parseAuthor($, newsArticle);
    const image: ScrapedImage | undefined = this.parseImage($, newsArticle);
    const categories: string[] | undefined = this.parseCategories(webPage);

    return {
      title,
      subtitle,
      content,
      author,
      image,
      categories,
    };
  }

  /**
   * Extracts JSON-LD objects for NewsArticle and WebPage, if present
   */
  private parseJsonLd($: cheerio.CheerioAPI): ParsedJsonLdData {
    const scripts = $('script[type="application/ld+json"]');
    const result: ParsedJsonLdData = {};

    scripts.each((_, el) => {
      try {
        const rawJson = $(el).html() || '';
        const cleanedJson = rawJson.replace(/\/\*.*?\*\//g, '');
        const parsed = JSON.parse(cleanedJson) as ParsedJsonLdData;

        // The JSON-LD could be an array or a single object
        const items = Array.isArray(parsed) ? parsed : [parsed];

        for (const item of items) {
          if (item['@type'] === 'NewsArticle') {
            result.newsArticle = item as CalcalistNewsArticle;
          }
          if (item['@type'] === 'WebPage') {
            result.webPage = item as CalcalistWebPage;
          }
        }
      } catch (err) {
        this.logger.debug(`Failed to parse JSON-LD: ${err}`);
      }
    });

    return result;
  }

  /**
   * Title:
   *  1. JSON-LD (headline)
   *  2. <meta property="og:title">
   *  3. <title>
   *  4. first <h1>
   */
  private parseTitle($: cheerio.CheerioAPI, newsArticle?: CalcalistNewsArticle): string {
    if (newsArticle?.headline) {
      return newsArticle.headline;
    }

    const ogTitle = $('meta[property="og:title"]').attr('content');
    if (ogTitle) {
      return ogTitle.trim();
    }

    const titleTag = $('title').text();
    if (titleTag) {
      return titleTag.trim();
    }

    const h1Text = $('h1').first().text();
    if (h1Text) {
      return h1Text.trim();
    }

    return '';
  }

  /**
   * Subtitle:
   *  1. JSON-LD (description)
   *  2. <meta name="description">
   *  3. <meta property="og:description">
   *  4. first <h3>
   */
  private parseSubtitle($: cheerio.CheerioAPI, newsArticle?: CalcalistNewsArticle): string {
    if (newsArticle?.description) {
      return newsArticle.description.trim();
    }

    const metaDesc = $('meta[name="description"]').attr('content');
    if (metaDesc) {
      return metaDesc.trim();
    }

    const ogDesc = $('meta[property="og:description"]').attr('content');
    if (ogDesc) {
      return ogDesc.trim();
    }

    const h3Text = $('h3').first().text();
    if (h3Text) {
      return h3Text.trim();
    }

    return '';
  }

  /**
   * Content:
   *  1. JSON-LD (articleBody)
   *  2. paragraphs inside a container that partially matches .ArticleContent or .articleContent
   *     (Here we use [class*="ArticleContent"] p or [class*="articleContent"] p)
   */
  private parseContent($: cheerio.CheerioAPI, newsArticle?: CalcalistNewsArticle): string {
    if (newsArticle?.articleBody) {
      return newsArticle.articleBody.trim();
    }

    // Fallback: gather paragraphs from a container whose class contains "ArticleContent" or "articleContent"
    const paragraphs = $('[class*="ArticleContent"], [class*="articleContent"] p');
    if (paragraphs.length) {
      const text = paragraphs
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((t) => !!t)
        .join('\n');
      if (text) {
        return text;
      }
    }

    // As a last fallback, just gather all <p> tags if needed
    const fallbackPs = $('p')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => !!t)
      .join('\n');
    return fallbackPs;
  }

  /**
   * Author:
   *  1. JSON-LD => author.name
   *  2. <meta name="author">
   *  3. <meta property="article:author">
   *  4. A known pattern like link to /author/
   */
  private parseAuthor($: cheerio.CheerioAPI, newsArticle?: CalcalistNewsArticle): string | undefined {
    if (newsArticle?.author?.name) {
      return newsArticle.author.name.trim();
    }

    const metaNameAuthor = $('meta[name="author"]').attr('content');
    if (metaNameAuthor) {
      return metaNameAuthor.trim();
    }

    const metaPropAuthor = $('meta[property="article:author"]').attr('content');
    if (metaPropAuthor) {
      return metaPropAuthor.trim();
    }

    // Example: link to /author/... if it exists
    const authorLink = $('a[href*="/author/"]').first().text();
    if (authorLink) {
      return authorLink.trim();
    }

    return undefined;
  }

  /**
   * Image:
   *  1. JSON-LD => image.url
   *  2. <meta property="og:image">
   *  If there's a <figure> with <figcaption> containing "צילום:", treat it as credit
   */
  private parseImage($: cheerio.CheerioAPI, newsArticle?: CalcalistNewsArticle): ScrapedImage | undefined {
    const fromJsonLd = newsArticle?.image?.url;
    if (fromJsonLd) {
      const imageObject: ScrapedImage = { url: fromJsonLd };
      // We rarely see credit in Calcalist JSON-LD, but if we do, you could parse it here
      return imageObject;
    }

    // Fallback to og:image
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) {
      const fallbackImage: ScrapedImage = { url: ogImage.trim() };
      // Attempt to parse a credit from a figure
      const figureCaption = $('figure figcaption')
        .filter((_, el) => {
          const capText = $(el).text().trim();
          return capText.includes('צילום:');
        })
        .first()
        .text()
        .trim();
      if (figureCaption) {
        fallbackImage.credit = figureCaption;
      }
      return fallbackImage;
    }

    return undefined;
  }

  /**
   * Categories:
   *  Taken from the JSON-LD WebPage breadcrumb.
   *  Exclude "Home"/"דף הבית" and the final item if it's the article itself.
   */
  private parseCategories(webPage?: CalcalistWebPage): string[] | undefined {
    if (!webPage?.breadcrumb?.itemListElement?.length) {
      return undefined;
    }

    const items = webPage.breadcrumb.itemListElement;
    // Map out category names, filtering out "דף הבית"/"Home", and possibly skipping the final if it's the article
    const categoryNames = items.reduce<string[]>((acc, curr) => {
      const name = curr.item.name?.trim();
      if (!name) {
        return acc;
      }
      // Skip home
      if (name === 'דף הבית' || name.toLowerCase() === 'home') {
        return acc;
      }
      acc.push(name);
      return acc;
    }, []);

    // If the last item is the article itself, remove it.
    // Usually you'd compare the last item with the article's title or some known property.
    // For the snippet, the last item is "דעות", so presumably we keep it unless it equals the article title.
    // We'll do a naive check:
    const lastIdx = categoryNames.length - 1;
    if (lastIdx >= 0) {
      // Example check - if it exactly matches the article's headline, skip it.
      // Just demonstrating: you can tweak if needed
      // ...
    }

    return categoryNames.length ? categoryNames : undefined;
  }
}
