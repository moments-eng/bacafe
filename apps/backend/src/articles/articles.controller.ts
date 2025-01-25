import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { ArticleStatsDto } from './dto/article-stats.dto';
import { ArticleDto } from './dto/article.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { ListArticlesDto } from './dto/list-articles.dto';
import { PaginatedArticlesDto } from './dto/paginated-articles.dto';
import { QueryArticlesDto } from './dto/query-articles.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
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
  async create(@Body() createArticleDto: CreateArticleDto): Promise<ArticleDto> {
    try {
      const article = await this.articlesService.create(createArticleDto);
      return ArticleDto.fromSchema(article);
    } catch (error: unknown) {
      throw new HttpException(
        `Failed to create article: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete article' })
  @ApiParam({ name: 'id', description: 'Article ID' })
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
      throw new HttpException(
        `Failed to delete article: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'List articles with pagination',
    description: 'Returns articles sorted by creation date (newest first)',
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
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns article statistics',
    type: ArticleStatsDto,
  })
  async getStats(): Promise<ArticleStatsDto> {
    return this.articlesService.getArticleStats();
  }
}
