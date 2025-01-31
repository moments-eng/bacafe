import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { extractErrorMessage } from 'src/utils/error';
import { ArticleQueueService } from '../article-queue/article-queue.service';
import { ArticlesService } from './articles.service';
import { ArticleStatsDto } from './dto/article-stats.dto';
import { ArticleDto } from './dto/article.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { ListArticlesDto } from './dto/list-articles.dto';
import { PaginatedArticlesDto } from './dto/paginated-articles.dto';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UpdateScrapingResultDto } from './dto/update-scraping-result.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly articleQueueService: ArticleQueueService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new article',
    description:
      'Creates a new article and queues it for scraping. If the article exists and forceScrape is true, it will be re-scraped.',
    operationId: 'createArticle',
  })
  @ApiBody({ type: CreateArticleDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The article has been successfully created.',
    type: ArticleDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid article data.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Article with this URL already exists.',
  })
  async create(@Body() createArticleDto: CreateArticleDto): Promise<ArticleDto> {
    try {
      const article = await this.articlesService.create(createArticleDto);
      return ArticleDto.fromSchema(article);
    } catch (error: unknown) {
      throw new HttpException(`Failed to create article: ${extractErrorMessage(error)}`, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete article',
    description: 'Permanently deletes an article by its ID',
    operationId: 'deleteArticle',
  })
  @ApiParam({
    name: 'id',
    description: 'Article ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The article has been deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.articlesService.delete(id);
    } catch (error: unknown) {
      throw new HttpException(`Failed to delete article: ${extractErrorMessage(error)}`, HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'List articles with pagination',
    description: 'Returns articles sorted by creation date (newest first)',
    operationId: 'listArticles',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of articles',
    type: PaginatedArticlesDto,
  })
  async findAll(@Query() query: ListArticlesDto): Promise<PaginatedArticlesDto> {
    const { page = 1, limit = 10 } = query;
    const { items, total } = await this.articlesService.findAll(page, limit);

    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map((article) => ArticleDto.fromSchema(article)),
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  @Post('query')
  @ApiOperation({
    summary: 'Query articles with filters and sorting',
    description: 'Returns filtered and sorted articles with pagination',
    operationId: 'queryArticles',
  })
  @ApiBody({ type: QueryArticlesDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns filtered and paginated list of articles',
    type: PaginatedArticlesDto,
  })
  async queryArticles(@Body() queryDto: QueryArticlesDto): Promise<PaginatedArticlesDto> {
    const { filter, sort, page = 1, limit = 10 } = queryDto;

    const { items, total } = await this.articlesService.queryArticles(filter, sort, page, limit);

    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map((article) => ArticleDto.fromSchema(article)),
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get article statistics',
    description: 'Returns aggregated statistics about articles',
    operationId: 'getArticleStats',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns article statistics',
    type: ArticleStatsDto,
  })
  async getStats(): Promise<ArticleStatsDto> {
    return this.articlesService.getArticleStats();
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update article metadata',
    description: 'Updates article metadata and enrichment data',
    operationId: 'updateArticle',
  })
  @ApiParam({
    name: 'id',
    description: 'Article ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateArticleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The article has been updated',
    type: ArticleDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid update data',
  })
  async update(@Param('id') id: string, @Body() updateDto: UpdateArticleDto): Promise<ArticleDto> {
    const article = await this.articlesService.update(id, updateDto);
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return ArticleDto.fromSchema(article);
  }

  @Put(':id/scraping-result')
  @ApiOperation({
    summary: 'Update article with scraping results',
    description: 'Updates an article with the results from scraping, including content and status',
    operationId: 'updateScrapingResult',
  })
  @ApiParam({
    name: 'id',
    description: 'Article ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({ type: UpdateScrapingResultDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The article has been updated with scraping results',
    type: ArticleDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Article not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid scraping result data',
  })
  async updateScrapingResult(@Param('id') id: string, @Body() updateDto: UpdateScrapingResultDto): Promise<ArticleDto> {
    const article = await this.articlesService.update(id, updateDto);
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return ArticleDto.fromSchema(article);
  }
}
