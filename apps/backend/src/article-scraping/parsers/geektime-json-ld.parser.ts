import { Logger } from '@nestjs/common';
import { extractErrorMessage } from 'src/utils/error';
import { match, P } from 'ts-pattern';
import {
  GeektimeJsonLdArticle,
  GeektimeJsonLdImageObject,
  GeektimeJsonLdPerson,
  GeektimeJsonLdRoot,
  GeektimeJsonLdType,
} from '../types/geektime-json-ld.types';

interface ParsedJsonLdData {
  title?: string;
  subtitle?: string;
  author?: string;
  image?: {
    url: string;
    credit?: string;
  };
  categories?: string[];
  keywords?: string[];
}

/**
 * Parser for Geektime's specific JSON-LD format
 */
export class GeektimeJsonLdParser {
  private readonly logger = new Logger(GeektimeJsonLdParser.name);

  /**
   * Parse Geektime's JSON-LD data from a script tag
   */
  public parseJsonLd(jsonLdString: string): ParsedJsonLdData | undefined {
    try {
      const jsonLd = JSON.parse(jsonLdString) as GeektimeJsonLdRoot;
      if (!jsonLd['@graph']) {
        return undefined;
      }

      const article = this.findArticle(jsonLd['@graph']);
      if (!article) {
        return undefined;
      }

      return this.parseArticleData(article, jsonLd['@graph']);
    } catch (error: unknown) {
      this.logger.debug(`Failed to parse Geektime JSON-LD data: ${extractErrorMessage(error)}`);
      return undefined;
    }
  }

  /**
   * Find the Article object in the JSON-LD graph
   */
  private findArticle(graph: GeektimeJsonLdType[]): GeektimeJsonLdArticle | undefined {
    return graph.find((item): item is GeektimeJsonLdArticle => item['@type'] === 'Article');
  }

  /**
   * Parse article data using pattern matching
   */
  private parseArticleData(article: GeektimeJsonLdArticle, graph: GeektimeJsonLdType[]): ParsedJsonLdData {
    const result: ParsedJsonLdData = {
      title: article.headline,
    };

    // Parse author
    result.author = match(article.author)
      .with({ '@type': 'Person', name: P.string }, (author) => author.name)
      .with({ name: P.string }, (author) => author.name)
      .with({ '@id': P.string }, (ref) => this.findPersonNameById(ref['@id'], graph))
      .otherwise(() => undefined);

    // Parse categories
    if (article.articleSection) {
      result.categories = Array.isArray(article.articleSection) ? article.articleSection : [article.articleSection];
    }

    // Parse keywords
    if (article.keywords) {
      result.keywords = article.keywords;
    }

    // Parse image
    result.image = match(article.image)
      .with({ '@id': P.string }, (ref) => this.findImageById(ref['@id'], graph))
      .with({ '@type': 'ImageObject' }, (img: GeektimeJsonLdImageObject) => ({
        url: img.contentUrl,
        credit: img.caption,
      }))
      .otherwise(() => undefined);

    return result;
  }

  /**
   * Find a person's name by their @id reference
   */
  private findPersonNameById(id: string, graph: GeektimeJsonLdType[]): string | undefined {
    const person = graph.find((item): item is GeektimeJsonLdPerson => item['@type'] === 'Person' && item['@id'] === id);
    return person?.name;
  }

  /**
   * Find an image by its @id reference
   */
  private findImageById(id: string, graph: GeektimeJsonLdType[]): { url: string; credit?: string } | undefined {
    const image = graph.find(
      (item): item is GeektimeJsonLdImageObject => item['@type'] === 'ImageObject' && item['@id'] === id,
    );

    if (!image) {
      return undefined;
    }

    return {
      url: image.contentUrl,
      credit: image.caption,
    };
  }
}
