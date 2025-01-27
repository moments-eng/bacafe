import { extractErrorMessage } from 'src/utils/error';

export interface ScrapedImage {
  url: string;
  credit?: string;
}

export interface ScrapingResult {
  content: string;
  author?: string;
  image?: ScrapedImage;
}

export abstract class BaseArticleScraper {
  abstract readonly provider: string;

  abstract scrape(url: string): Promise<ScrapingResult>;

  protected async fetchPage(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${response.statusText}`);
      }
      return await response.text();
    } catch (error: unknown) {
      throw new Error(`Error fetching page: ${extractErrorMessage(error)}`);
    }
  }
}
