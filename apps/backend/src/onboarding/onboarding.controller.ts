import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddArticleToOnboardingDto, UpdateArticlePositionsDto } from './dto/article-operations.dto';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { OnboardingDto } from './dto/onboarding.dto';
import { PaginatedOnboardingDto } from './dto/paginated-onboarding.dto';
import { OnboardingService } from './onboarding.service';

@ApiTags('onboarding')
@Controller('onboarding')
@UseInterceptors(ClassSerializerInterceptor)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  @ApiOperation({ summary: 'Create new onboarding configuration', operationId: 'createOnboarding' })
  @ApiBody({ type: CreateOnboardingDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: OnboardingDto })
  async create(@Body() dto: CreateOnboardingDto): Promise<OnboardingDto> {
    return this.onboardingService.create(dto);
  }

  @Get('production')
  @ApiOperation({
    summary: 'Get the current production onboarding configuration',
    operationId: 'getProductionOnboarding',
  })
  @ApiResponse({ status: HttpStatus.OK, type: OnboardingDto })
  async getProductionVersion(): Promise<OnboardingDto> {
    return this.onboardingService.getProductionVersion();
  }

  @Get()
  @ApiOperation({ summary: 'List all onboarding configurations', operationId: 'listOnboardings' })
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
  @ApiOperation({ summary: 'Get onboarding details', operationId: 'getOnboardingById' })
  @ApiParam({ name: 'id', description: 'Onboarding ID' })
  @ApiResponse({ status: HttpStatus.OK, type: OnboardingDto })
  async findOne(@Param('id') id: string): Promise<OnboardingDto> {
    return this.onboardingService.findOne(id);
  }

  @Patch(':id/articles')
  @ApiOperation({ summary: 'Add article to onboarding', operationId: 'addArticleToOnboarding' })
  @ApiParam({ name: 'id', description: 'Onboarding ID' })
  @ApiBody({ type: AddArticleToOnboardingDto })
  @ApiResponse({ status: HttpStatus.OK, type: OnboardingDto })
  async addArticle(@Param('id') id: string, @Body() dto: AddArticleToOnboardingDto): Promise<OnboardingDto> {
    return this.onboardingService.addArticle(id, dto);
  }

  @Delete(':id/articles/:articleId')
  @ApiOperation({ summary: 'Remove article from onboarding', operationId: 'removeArticleFromOnboarding' })
  @ApiParam({ name: 'id', description: 'Onboarding ID' })
  @ApiParam({ name: 'articleId', description: 'Article ID to remove' })
  @ApiResponse({ status: HttpStatus.OK, type: OnboardingDto })
  async removeArticle(@Param('id') id: string, @Param('articleId') articleId: string): Promise<OnboardingDto> {
    return this.onboardingService.removeArticle(id, articleId);
  }

  @Post(':id/promote')
  @ApiOperation({ summary: 'Promote onboarding to production', operationId: 'promoteOnboardingToProduction' })
  @ApiParam({ name: 'id', description: 'Onboarding ID' })
  @ApiResponse({ status: HttpStatus.OK, type: OnboardingDto })
  async promoteToProduction(@Param('id') id: string): Promise<OnboardingDto> {
    return this.onboardingService.promoteToProduction(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete onboarding configuration', operationId: 'deleteOnboarding' })
  @ApiParam({ name: 'id', description: 'Onboarding ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(@Param('id') id: string): Promise<void> {
    return this.onboardingService.remove(id);
  }

  @Patch(':id/articles/positions')
  @ApiOperation({ summary: 'Update article positions in bulk', operationId: 'updateOnboardingArticlePositions' })
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
