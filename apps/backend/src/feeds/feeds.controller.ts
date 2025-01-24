import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CreateFeedDto } from './dto/create-feed.dto';
import { FeedDto } from './dto/feed.dto';
import { UpdateFeedStatusDto } from './dto/update-feed-status.dto';
import { FeedsService } from './feeds.service';

@ApiTags('feeds')
@Controller('feeds')
export class FeedsController {
	constructor(private readonly feedsService: FeedsService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new feed from RSS URL' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'The feed has been successfully created.',
		type: FeedDto,
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid feed data or RSS URL.',
	})
	@ApiResponse({
		status: HttpStatus.CONFLICT,
		description: 'Feed with this URL already exists.',
	})
	async create(@Body() createFeedDto: CreateFeedDto): Promise<FeedDto> {
		try {
			return await this.feedsService.createFromRss(createFeedDto);
		} catch (error) {
			if (error.code === 11000) {
				// MongoDB duplicate key error
				throw new HttpException(
					'Feed with this URL already exists',
					HttpStatus.CONFLICT,
				);
			}
			throw new HttpException(
				`Failed to create feed: ${error.message}`,
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Get()
	@ApiOperation({ summary: 'Get all feeds' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Returns all feeds',
		type: [FeedDto],
	})
	@HttpCode(HttpStatus.OK)
	async findAll(): Promise<FeedDto[]> {
		return this.feedsService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a feed by ID' })
	@ApiParam({ name: 'id', description: 'Feed ID' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Returns the feed',
		type: FeedDto,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Feed not found',
	})
	@HttpCode(HttpStatus.OK)
	async findOne(@Param('id') id: string): Promise<FeedDto> {
		try {
			return await this.feedsService.findById(id);
		} catch (error) {
			throw new HttpException('Feed not found', HttpStatus.NOT_FOUND);
		}
	}

	@Patch(':id/status')
	@ApiOperation({ summary: 'Update feed status and scraping interval' })
	@ApiParam({ name: 'id', description: 'Feed ID' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'The feed status has been updated',
		type: FeedDto,
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Feed not found',
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid status data',
	})
	@HttpCode(HttpStatus.OK)
	async updateStatus(
		@Param('id') id: string,
		@Body() updateFeedStatusDto: UpdateFeedStatusDto,
	): Promise<FeedDto> {
		try {
			return await this.feedsService.updateFeedStatus(
				id,
				updateFeedStatusDto.isActive,
				updateFeedStatusDto.scrapingInterval,
			);
		} catch (error) {
			if (error.message === 'Feed not found') {
				throw new HttpException('Feed not found', HttpStatus.NOT_FOUND);
			}
			throw new HttpException(
				`Failed to update feed status: ${error.message}`,
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a feed' })
	@ApiParam({ name: 'id', description: 'Feed ID' })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'The feed has been deleted',
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Feed not found',
	})
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string): Promise<void> {
		try {
			await this.feedsService.delete(id);
		} catch (error) {
			throw new HttpException('Feed not found', HttpStatus.NOT_FOUND);
		}
	}
}
