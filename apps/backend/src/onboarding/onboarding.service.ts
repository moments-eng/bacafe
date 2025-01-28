import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ArticlesService } from '../articles/articles.service';
import { AddArticleToOnboardingDto, UpdateArticlePositionsDto } from './dto/article-operations.dto';
import type { CreateOnboardingDto, OnboardingArticleDto } from './dto/create-onboarding.dto';
import { Onboarding } from './schemas/onboarding.schema';
import { OnboardingDto } from './dto/onboarding.dto';
import { PaginatedOnboardingDto } from './dto/paginated-onboarding.dto';
import { ArticleDocument } from '../articles/schemas/article.schema';

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  constructor(
    @InjectModel(Onboarding.name) private onboardingModel: Model<Onboarding>,
    private readonly articlesService: ArticlesService,
  ) {}

  async create(createOnboardingDto: CreateOnboardingDto): Promise<OnboardingDto> {
    // Validate articles and positions
    await this.validateArticles(createOnboardingDto.articles);
    this.validatePositions(createOnboardingDto.articles);

    const onboardingArticles = createOnboardingDto.articles.map((a) => ({
      article: new Types.ObjectId(a.articleId),
      position: a.position,
    }));

    const createdOnboarding = new this.onboardingModel({
      articles: onboardingArticles,
      isProduction: false,
    });

    const doc = await createdOnboarding
      .save()
      .then((doc) => doc.populate('articles.article'))
      .catch(this.handleError('create'));

    return OnboardingDto.fromSchema(doc);
  }

  async addArticle(id: string, dto: AddArticleToOnboardingDto): Promise<OnboardingDto> {
    await this.articlesService.exists(dto.articleId);

    const doc = await this.onboardingModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            articles: {
              article: new Types.ObjectId(dto.articleId),
              position: dto.position,
            },
          },
        },
        { new: true },
      )
      .populate('articles.article')
      .orFail(() => new NotFoundException('Onboarding not found'))
      .catch(this.handleError('add article'));

    return OnboardingDto.fromSchema(doc);
  }

  async removeArticle(id: string, articleId: string): Promise<OnboardingDto> {
    const doc = await this.onboardingModel
      .findByIdAndUpdate(
        id,
        {
          $pull: {
            articles: { article: new Types.ObjectId(articleId) },
          },
        },
        { new: true },
      )
      .populate('articles.article')
      .orFail(() => new NotFoundException('Onboarding not found'))
      .catch(this.handleError('remove article'));

    return OnboardingDto.fromSchema(doc);
  }

  async updateArticlePositions(id: string, dto: UpdateArticlePositionsDto): Promise<OnboardingDto> {
    // Find the onboarding
    const onboarding = await this.onboardingModel
      .findById(id)
      .orFail(() => new NotFoundException('Onboarding not found'));

    // Create a map of articleId to position for quick lookup
    const positionMap = new Map(dto.positions.map(({ articleId, position }) => [articleId, position]));

    // Update each article's position
    onboarding.articles = onboarding.articles.map((article) => {
      const articleId =
        article.article instanceof Types.ObjectId
          ? article.article.toString()
          : (article.article as ArticleDocument)._id.toString();

      const newPosition = positionMap.get(articleId);

      if (typeof newPosition === 'number') {
        return {
          ...article,
          position: newPosition,
        };
      }
      return article;
    });

    // Save the updated onboarding
    const updatedDoc = await onboarding.save().then((doc) => doc.populate('articles.article'));

    return OnboardingDto.fromSchema(updatedDoc);
  }

  private async validateArticles(articles: OnboardingArticleDto[]): Promise<void> {
    await Promise.all(
      articles.map(async (a) => {
        const exists = await this.articlesService.findById(a.articleId);
        if (!exists) {
          throw new BadRequestException(`Article ${a.articleId} not found`);
        }
      }),
    );
  }

  private validatePositions(articles: OnboardingArticleDto[]): void {
    const positions = articles.map((a) => a.position);
    if (new Set(positions).size !== positions.length) {
      throw new BadRequestException('Duplicate positions found');
    }
  }

  private handleError(operation: string) {
    return (error: Error) => {
      this.logger.error(`Failed to ${operation}: ${error.message}`);
      throw new BadRequestException(`Failed to ${operation}`);
    };
  }

  async findAll(page: number, limit: number): Promise<PaginatedOnboardingDto> {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this.onboardingModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate('articles.article').exec(),
      this.onboardingModel.countDocuments(),
    ]);

    return {
      items: docs.map((doc) => OnboardingDto.fromSchema(doc)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    };
  }

  async findOne(id: string): Promise<OnboardingDto> {
    const doc = await this.onboardingModel
      .findById(id)
      .populate('articles.article')
      .orFail(() => new NotFoundException(`Onboarding configuration with ID ${id} not found`))
      .exec();

    return OnboardingDto.fromSchema(doc);
  }

  async getProductionVersion(): Promise<OnboardingDto> {
    const doc = await this.onboardingModel
      .findOne({ isProduction: true })
      .populate('articles.article')
      .orFail(() => new NotFoundException('No production onboarding configuration found'))
      .exec();

    return OnboardingDto.fromSchema(doc);
  }

  async promoteToProduction(id: string): Promise<OnboardingDto> {
    try {
      // First, demote the current production onboarding if exists
      await this.onboardingModel.findOneAndUpdate({ isProduction: true }, { isProduction: false });

      // Then promote the new one and return it with populated articles
      const promotedOnboarding = await this.onboardingModel
        .findByIdAndUpdate(id, { isProduction: true }, { new: true })
        .populate('articles.article')
        .orFail(() => new NotFoundException(`Onboarding configuration with ID ${id} not found`));

      return OnboardingDto.fromSchema(promotedOnboarding);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logger.error(`Failed to promote onboarding: ${errorMessage}`);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.onboardingModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Onboarding configuration with ID ${id} not found`);
    }
  }
}
