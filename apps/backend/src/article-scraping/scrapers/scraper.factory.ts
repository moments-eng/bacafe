import { Injectable, Logger } from '@nestjs/common';
import { BaseArticleScraper } from './base.scraper';
import { YnetScraper } from './ynet.scraper';

@Injectable()
export class ScraperFactory {
  private readonly logger = new Logger(ScraperFactory.name);
  private readonly scrapers = new Map<string, BaseArticleScraper>();

  constructor(
    private readonly ynetScraper: YnetScraper,
    // Add other scrapers here as they are created
  ) {
    this.registerScrapers();
  }

  private registerScrapers(): void {
    this.addScraper(this.ynetScraper);
    // Register other scrapers here
  }

  private addScraper(scraper: BaseArticleScraper): void {
    this.scrapers.set(scraper.provider, scraper);
    this.logger.log(`Registered scraper for provider: ${scraper.provider}`);
  }

  getScraper(provider: string): BaseArticleScraper {
    const scraper = this.scrapers.get(provider);
    if (!scraper) {
      throw new Error(`No scraper found for provider: ${provider}`);
    }
    return scraper;
  }
}
