import { Injectable, Logger } from '@nestjs/common';
import * as Parser from 'rss-parser';
import { extractErrorMessage } from 'src/utils/error';
import { FeedChannelRepository } from '../feed-channel/feed-channel.repository';
import { FeedScrapingService } from '../feed-scraping/feed-scraping.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { FeedDto } from './dto/feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { FeedChannel } from './schemas/feed-channel.schema';
import { FilterQuery } from 'mongoose';
import { FeedFilterDto, FeedSortDto } from './dto/query-feeds.dto';
import { CreateBulkFeedsDto } from './dto/create-bulk-feeds.dto';

@Injectable()
export class FeedsService {
  private readonly logger = new Logger(FeedsService.name);

  constructor(
    private readonly feedChannelRepository: FeedChannelRepository,
    private readonly feedScrapingService: FeedScrapingService,
  ) {}

  async findAll(): Promise<FeedDto[]> {
    const feeds = await this.feedChannelRepository.findAll();
    return feeds.map((feed) => feed.toDto());
  }

  async queryFeeds(
    filter?: FeedFilterDto,
    sort?: FeedSortDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    items: FeedDto[];
    total: number;
  }> {
    this.logger.debug(`Querying feeds with filter: ${JSON.stringify(filter)}, sort: ${JSON.stringify(sort)}`);

    const query: FilterQuery<FeedChannel> = {};
    const sortCriteria: Record<string, 1 | -1> = {};

    // Build filter query
    if (filter) {
      if (filter.name) {
        query.name = { $regex: filter.name, $options: 'i' };
      }
      if (filter.url) {
        query.url = { $regex: filter.url, $options: 'i' };
      }
      if (filter.provider) {
        query.provider = { $regex: filter.provider, $options: 'i' };
      }
      if (filter.language) {
        query.language = filter.language;
      }
      if (filter.isActive !== undefined) {
        query.isActive = filter.isActive;
      }
      if (filter.categories?.length) {
        query.categories = { $in: filter.categories };
      }
    }

    // Build sort criteria
    if (sort) {
      Object.entries(sort).forEach(([field, direction]) => {
        sortCriteria[field] = direction === 'asc' ? 1 : -1;
      });
    } else {
      // Default sort by createdAt desc
      sortCriteria.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    try {
      const [items, total] = await Promise.all([
        this.feedChannelRepository.findWithQuery(query, sortCriteria, skip, limit),
        this.feedChannelRepository.countWithQuery(query),
      ]);

      return {
        items: items.map((feed) => feed.toDto()),
        total,
      };
    } catch (error) {
      this.logger.error(`Failed to query feeds: ${extractErrorMessage(error)}`);
      throw error;
    }
  }

  async findByProvider(provider: string): Promise<FeedDto[]> {
    this.logger.debug(`Finding feeds by provider: ${provider}`);
    const feeds = await this.feedChannelRepository.findByProvider(provider);
    return feeds.map((feed) => feed.toDto());
  }

  async createBulkFeeds(createBulkFeedsDto: CreateBulkFeedsDto): Promise<FeedDto[]> {
    const { provider, urls, categories } = createBulkFeedsDto;
    const urlList = urls.split(',').map((url) => url.trim());

    this.logger.debug(`Creating bulk feeds for provider ${provider} with URLs: ${urlList.join(', ')}`);

    const parser = new Parser();
    const results: FeedDto[] = [];
    const errors: { url: string; error: string }[] = [];

    await Promise.all(
      urlList.map(async (url) => {
        try {
          const feed = await parser.parseURL(url);
          const feedChannel: Partial<FeedChannel> = {
            name: feed.title || 'Unnamed Feed',
            url,
            provider,
            language: typeof feed.language === 'string' ? feed.language : 'he',
            categories,
            isActive: false,
            scrapingInterval: -1,
            description: feed.description,
          };

          const created = await this.feedChannelRepository.upsertByUrl(url, feedChannel);
          results.push(created.toDto());
        } catch (error) {
          const errorMessage = extractErrorMessage(error);
          this.logger.error(`Failed to create feed for URL ${url}: ${errorMessage}`);
          errors.push({ url, error: errorMessage });
        }
      }),
    );

    if (errors.length > 0) {
      this.logger.warn(`Some feeds failed to be created: ${JSON.stringify(errors)}`);
    }

    return results;
  }

  async updateLastScrapedAt(id: string): Promise<void> {
    await this.feedChannelRepository.updateLastScrapedAt(id);
  }

  async findDueForScraping(): Promise<FeedDto[]> {
    const feeds = await this.feedChannelRepository.findDueForScraping();
    return feeds.map((feed) => feed.toDto());
  }

  async createFromRss(createFeedDto: CreateFeedDto): Promise<FeedDto> {
    try {
      const parser = new Parser();
      const feed = await parser.parseURL(createFeedDto.url);

      const feedChannel: Partial<FeedChannel> = {
        name: feed.title || 'Unnamed Feed',
        url: createFeedDto.url,
        provider: createFeedDto.provider,
        language: typeof feed.language === 'string' ? feed.language : 'he',
        categories: createFeedDto.categories,
        isActive: false,
        scrapingInterval: -1,
        description: feed.description,
      };

      const created = await this.feedChannelRepository.upsertByUrl(createFeedDto.url, feedChannel);
      return created.toDto();
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      this.logger.error(`Failed to parse RSS feed: ${message}`);
      throw error;
    }
  }

  async updateFeedStatus(id: string, isActive: boolean, scrapingInterval?: number): Promise<FeedDto> {
    const updated = await this.feedChannelRepository.updateFeedStatus(id, isActive, scrapingInterval);

    try {
      if (updated.isActive && updated.scrapingInterval > 0) {
        await this.feedScrapingService.scheduleRecurringJob(updated);
      } else {
        await this.feedScrapingService.removeScheduledJob(id);
      }
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      this.logger.error(`Failed to manage job scheduler for feed ${id}: ${message}`);
      throw error;
    }

    return updated.toDto();
  }

  async findById(id: string): Promise<FeedDto> {
    const feed = await this.feedChannelRepository.findById(id);
    return feed.toDto();
  }

  async delete(id: string): Promise<void> {
    await this.feedChannelRepository.delete(id);
  }

  async updateFeed(id: string, updateFeedDto: UpdateFeedDto): Promise<FeedDto> {
    const updated = await this.feedChannelRepository.updateFeed(id, updateFeedDto);

    try {
      if (updated.isActive && updated.scrapingInterval > 0) {
        await this.feedScrapingService.scheduleRecurringJob(updated);
      } else {
        await this.feedScrapingService.removeScheduledJob(id);
      }
    } catch (error: any) {
      this.logger.error(
        `Failed to manage job scheduler for feed ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }

    return updated.toDto();
  }

  async triggerScrape(id: string): Promise<void> {
    const feed = await this.feedChannelRepository.findById(id);
    await this.feedScrapingService.triggerImmediateScrape(feed);
  }
}
