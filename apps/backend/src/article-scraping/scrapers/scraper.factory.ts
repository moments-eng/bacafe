import { Injectable, Logger } from '@nestjs/common';
import { BaseArticleScraper } from './base.scraper';
import { CalcalistScraper } from './calcalist.scraper';
import { GeektimeScraper } from './geektime.scraper';
import { I24NewsScraper } from './i24news.scraper';
import { Now14Scraper } from './now14.scraper';
import { WallaScraper } from './walla.scraper';
import { YnetScraper } from './ynet.scraper';

@Injectable()
export class ScraperFactory {
  private readonly logger = new Logger(ScraperFactory.name);
  private readonly scrapers = new Map<string, BaseArticleScraper>();

  constructor(
    private readonly ynetScraper: YnetScraper,
    private readonly geektimeScraper: GeektimeScraper,
    private readonly i24NewsScraper: I24NewsScraper,
    private readonly calcalistScraper: CalcalistScraper,
    private readonly now14Scraper: Now14Scraper,
    private readonly wallaScraper: WallaScraper,
  ) {
    this.registerScrapers();
  }

  private registerScrapers(): void {
    this.addScraper(this.ynetScraper);
    this.addScraper(this.geektimeScraper);
    this.addScraper(this.i24NewsScraper);
    this.addScraper(this.calcalistScraper);
    this.addScraper(this.now14Scraper);
    this.addScraper(this.wallaScraper);
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
