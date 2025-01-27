import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { OnboardingDto } from './dto/onboarding.dto';
import { PaginatedOnboardingDto } from './dto/paginated-onboarding.dto';
import { AddArticleToOnboardingDto, UpdateArticlePositionsDto } from './dto/article-operations.dto';

@ApiTags('onboarding')
@Controller('onboarding')
@UseInterceptors(ClassSerializerInterceptor)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  @ApiOperation({ summary: 'Create new onboarding configuration' })
  @ApiBody({ type: CreateOnboardingDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: OnboardingDto })
  async create(@Body() dto: CreateOnboardingDto): Promise<OnboardingDto> {
    return this.onboardingService.create(dto);
  }

  @Get('production')
  @ApiOperation({ summary: 'Get the current production onboarding configuration' })
  @ApiResponse({ status: HttpStatus.OK, type: OnboardingDto })
  async getProductionVersion(): Promise<OnboardingDto> {
    return this.onboardingService.getProductionVersion();
  }

  @Get()
  @ApiOperation({ summary: 'List all onboarding configurations' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: PaginatedOnboardingDto })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10): Promise<PaginatedOnboardingDto> {
    const { items, total } = await this.onboardingService.findAll(page, limit);
    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get onboarding details' })
  @ApiParam({ name: 'id', description: 'Onboarding ID' })
  @ApiResponse({ status: HttpStatus.OK, type: OnboardingDto })
  async findOne(@Param('id') id: string): Promise<OnboardingDto> {
    return this.onboardingService.findOne(id);
  }

  @Patch(':id/articles')
  @ApiOperation({ summary: 'Add article to onboarding' })
  @ApiParam({ name: 'id', description: 'Onboarding ID' })
  @ApiBody({ type: AddArticleToOnboardingDto })
  @ApiResponse({ status: HttpStatus.OK, type: OnboardingDto })
  async addArticle(@Param('id') id: string, @Body() dto: AddArticleToOnboardingDto): Promise<OnboardingDto> {
    return this.onboardingService.addArticle(id, dto);
  }

  @Delete(':id/articles/:articleId')
  @ApiOperation({ summary: 'Remove article from onboarding' })
  @ApiParam({ name: 'id', description: 'Onboarding ID' })
  @ApiParam({ name: 'articleId', description: 'Article ID to remove' })
  @ApiResponse({ status: HttpStatus.OK, type: OnboardingDto })
  async removeArticle(@Param('id') id: string, @Param('articleId') articleId: string): Promise<OnboardingDto> {
    return this.onboardingService.removeArticle(id, articleId);
  }

  @Post(':id/promote')
  @ApiOperation({ summary: 'Promote onboarding to production' })
  @ApiParam({ name: 'id', description: 'Onboarding ID' })
  @ApiResponse({ status: HttpStatus.OK, type: OnboardingDto })
  async promoteToProduction(@Param('id') id: string): Promise<OnboardingDto> {
    return this.onboardingService.promoteToProduction(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete onboarding configuration' })
  @ApiParam({ name: 'id', description: 'Onboarding ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(@Param('id') id: string): Promise<void> {
    return this.onboardingService.remove(id);
  }

  @Patch(':id/articles/positions')
  @ApiOperation({ summary: 'Update article positions in bulk' })
  @ApiParam({ name: 'id', description: 'Onboarding ID' })
  @ApiBody({ type: UpdateArticlePositionsDto })
  @ApiResponse({ status: HttpStatus.OK, type: OnboardingDto })
  async updateArticlePositions(
    @Param('id') id: string,
    @Body() dto: UpdateArticlePositionsDto,
  ): Promise<OnboardingDto> {
    return this.onboardingService.updateArticlePositions(id, dto);
  }
}
