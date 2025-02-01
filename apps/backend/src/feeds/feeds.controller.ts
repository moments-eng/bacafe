import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Error } from 'mongoose';
import { extractErrorMessage } from 'src/utils/error';
import { CreateBulkFeedsDto } from './dto/create-bulk-feeds.dto';
import { CreateFeedDto } from './dto/create-feed.dto';
import { FeedDto } from './dto/feed.dto';
import { PaginatedFeedsDto } from './dto/paginated-feeds.dto';
import { QueryFeedsDto } from './dto/query-feeds.dto';
import { UpdateFeedStatusDto } from './dto/update-feed-status.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { FeedsService } from './feeds.service';

@ApiTags('feeds')
@Controller('feeds')
export class FeedsController {
  private readonly logger = new Logger(FeedsController.name);

  constructor(private readonly feedsService: FeedsService) {}

  private handleServiceError(error: unknown, context: string): never {
    const errorMessage = extractErrorMessage(error);
    const stack = error instanceof Error ? error.stack : undefined;

    if (error instanceof Error.DocumentNotFoundError) {
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    this.logger.error(`[${context}] ${errorMessage}`, stack);
    throw new HttpException(`Operation failed: ${errorMessage}`, HttpStatus.BAD_REQUEST);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new feed from RSS URL', operationId: 'createFeed' })
  @ApiResponse({ status: HttpStatus.CREATED, type: FeedDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.CONFLICT })
  async create(@Body() createFeedDto: CreateFeedDto): Promise<FeedDto> {
    try {
      return await this.feedsService.createFromRss(createFeedDto);
    } catch (error) {
      this.handleServiceError(error, 'FeedCreation');
    }
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Create multiple feeds for a provider from comma-separated URLs',
    operationId: 'createBulkFeeds',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: [FeedDto] })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  async createBulk(@Body() createBulkFeedsDto: CreateBulkFeedsDto): Promise<FeedDto[]> {
    try {
      return await this.feedsService.createBulkFeeds(createBulkFeedsDto);
    } catch (error) {
      this.handleServiceError(error, 'BulkFeedCreation');
    }
  }

  @Post('query')
  @ApiOperation({
    summary: 'Query feeds with filters and pagination',
    description: 'Returns filtered and paginated list of feeds based on provided criteria',
    operationId: 'queryFeeds',
  })
  @ApiBody({ type: QueryFeedsDto })
  @ApiResponse({ status: HttpStatus.OK, type: PaginatedFeedsDto })
  @HttpCode(HttpStatus.OK)
  async queryFeeds(@Body() queryDto: QueryFeedsDto): Promise<PaginatedFeedsDto> {
    try {
      const { filter, sort, page = 1, limit = 10 } = queryDto;
      const { items, total } = await this.feedsService.queryFeeds(filter, sort, page, limit);
      const totalPages = Math.ceil(total / limit);

      return {
        items,
        total,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    } catch (error) {
      this.handleServiceError(error, 'FeedQuery');
    }
  }

  @Get('provider/:provider')
  @ApiOperation({ summary: 'Get feeds by provider', operationId: 'findFeedsByProvider' })
  @ApiParam({ name: 'provider', description: 'Provider name' })
  @ApiResponse({ status: HttpStatus.OK, type: [FeedDto] })
  @HttpCode(HttpStatus.OK)
  async findByProvider(@Param('provider') provider: string): Promise<FeedDto[]> {
    try {
      return await this.feedsService.findByProvider(provider);
    } catch (error) {
      this.handleServiceError(error, 'ProviderFeedsFetch');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a feed by ID', operationId: 'findFeedById' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: FeedDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<FeedDto> {
    try {
      return await this.feedsService.findById(id);
    } catch (error) {
      this.handleServiceError(error, 'FeedFetch');
    }
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update feed status and scraping interval', operationId: 'updateFeedStatus' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: FeedDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @HttpCode(HttpStatus.OK)
  async updateStatus(@Param('id') id: string, @Body() updateFeedStatusDto: UpdateFeedStatusDto): Promise<FeedDto> {
    try {
      return await this.feedsService.updateFeedStatus(
        id,
        updateFeedStatusDto.isActive,
        updateFeedStatusDto.scrapingInterval,
      );
    } catch (error) {
      this.handleServiceError(error, 'StatusUpdate');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a feed', operationId: 'deleteFeed' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.feedsService.delete(id);
    } catch (error) {
      this.handleServiceError(error, 'FeedDeletion');
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update feed properties', operationId: 'updateFeed' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.OK, type: FeedDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @ApiBody({ type: UpdateFeedDto })
  async update(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto): Promise<FeedDto> {
    try {
      return await this.feedsService.updateFeed(id, updateFeedDto);
    } catch (error) {
      this.handleServiceError(error, 'FeedUpdate');
    }
  }

  @Post(':id/scrape')
  @ApiOperation({ summary: 'Trigger immediate feed scraping', operationId: 'scrapeFeedNow' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: HttpStatus.ACCEPTED })
  @ApiResponse({ status: HttpStatus.NOT_FOUND })
  @HttpCode(HttpStatus.ACCEPTED)
  async scrapeNow(@Param('id') id: string): Promise<void> {
    try {
      await this.feedsService.triggerScrape(id);
    } catch (error) {
      this.handleServiceError(error, 'ImmediateScrape');
    }
  }
}
