import { Injectable, Logger, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Article, type ArticleDocument, ArticleScrapingStatus } from './schemas/article.schema';
import { ArticleFilterDto, ArticleSortDto } from './dto/query-articles.dto';
import { ArticleStatsDto } from './dto/article-stats.dto';
import { extractErrorMessage } from 'src/utils/error';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleQueueService } from '../article-queue/article-queue.service';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private readonly articleQueueService: ArticleQueueService,
  ) {}

  async findByUrl(url: string): Promise<ArticleDocument | null> {
    if (!url) {
      throw new BadRequestException('URL is required');
    }
    return this.articleModel.findOne({ url }).exec();
  }

  async create(createArticleDto: CreateArticleDto): Promise<ArticleDocument> {
    try {
      const { url, source, externalId, forceScrape } = createArticleDto;

      // Check if article exists by URL
      const existingArticle = await this.findByUrl(url);

      if (existingArticle) {
        if (!forceScrape) {
          throw new ConflictException('Article with this URL already exists');
        }

        // Update scraping status for re-scraping
        existingArticle.scrapingStatus = ArticleScrapingStatus.PENDING;
        existingArticle.scrapingError = undefined;
        const savedArticle = await existingArticle.save();

        // Queue for re-scraping
        await this.queueForScraping(savedArticle);
        return savedArticle;
      }

      // Generate a deterministic externalId if not provided
      const finalExternalId = externalId || `${source}-${Buffer.from(url).toString('base64')}`;

      // Create new article
      const newArticle = new this.articleModel({
        url,
        source,
        externalId: finalExternalId,
        scrapingStatus: ArticleScrapingStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const savedArticle = await newArticle.save();

      // Queue for initial scraping
      await this.queueForScraping(savedArticle);

      this.logger.log(`Created new article with ID: ${savedArticle._id}`);
      return savedArticle;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Failed to create article: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Failed to create article');
    }
  }

  private async queueForScraping(article: ArticleDocument): Promise<void> {
    try {
      await this.articleQueueService.queueArticleForScraping(article._id.toString(), article.url);
    } catch (error) {
      // If queueing fails, mark the article as failed
      article.scrapingStatus = ArticleScrapingStatus.FAILED;
      article.scrapingError = error instanceof Error ? error.message : 'Failed to queue for scraping';
      await article.save();
      throw error;
    }
  }

  async findByExternalId(externalId: string): Promise<Article | null> {
    return this.articleModel.findOne({ externalId }).exec();
  }

  async exists(externalId: string): Promise<boolean> {
    const count = await this.articleModel.countDocuments({ externalId }).exec();
    return count > 0;
  }

  async findById(id: string): Promise<ArticleDocument | null> {
    return this.articleModel.findById(id);
  }
  async update(id: string, updateData: Partial<Article>): Promise<ArticleDocument | null> {
    return this.articleModel.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    items: ArticleDocument[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.articleModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.articleModel.countDocuments(),
    ]);

    return {
      items,
      total,
    };
  }

  async delete(id: string): Promise<void> {
    const result = await this.articleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('Article not found');
    }
  }

  async queryArticles(
    filter?: ArticleFilterDto,
    sort?: ArticleSortDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    items: ArticleDocument[];
    total: number;
  }> {
    const query: FilterQuery<ArticleDocument> = {};
    const sortCriteria: Record<string, 1 | -1> = {};

    // Build filter query
    if (filter) {
      if (filter.title) {
        query.title = { $regex: filter.title, $options: 'i' };
      }
      if (filter.subtitle) {
        query.subtitle = { $regex: filter.subtitle, $options: 'i' };
      }
      if (filter.source) {
        query.source = { $regex: filter.source, $options: 'i' };
      }
      if (filter.author) {
        query.author = { $regex: filter.author, $options: 'i' };
      }
      if (filter.categories?.length) {
        query.categories = { $in: filter.categories };
      }
      if (filter.publishedAtFrom || filter.publishedAtTo) {
        query.publishedAt = {};
        if (filter.publishedAtFrom) {
          query.publishedAt.$gte = filter.publishedAtFrom;
        }
        if (filter.publishedAtTo) {
          query.publishedAt.$lte = filter.publishedAtTo;
        }
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
        this.articleModel.find(query).sort(sortCriteria).skip(skip).limit(limit).exec(),
        this.articleModel.countDocuments(query),
      ]);

      return {
        items,
        total,
      };
    } catch (error) {
      this.logger.error(`Failed to query articles: ${extractErrorMessage(error)}`);
      throw error;
    }
  }

  async getArticleStats(): Promise<ArticleStatsDto> {
    const [totalArticles, articlesPerProvider, providers, scrapedCount, enrichedCount] = await Promise.all([
      this.articleModel.countDocuments(),
      this.articleModel.aggregate<{ source: string; count: number }>([
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $project: { _id: 0, source: '$_id', count: 1 } },
      ]),
      this.articleModel.distinct('source'),
      this.articleModel.countDocuments({ content: { $exists: true } }),
      this.articleModel.countDocuments({ enrichment: { $exists: true } }),
    ]);

    const providerStats = articlesPerProvider.reduce(
      (acc, curr) => {
        acc[curr.source] = curr.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalArticles,
      articlesPerProvider: providerStats,
      providers,
      scrapedCount,
      enrichedCount,
    };
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<ArticleDocument[]> {
    interface DateRangeQuery {
      createdAt: {
        $gte: Date;
        $lte: Date;
      };
    }

    const query: FilterQuery<DateRangeQuery> = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    return this.articleModel.find(query).exec();
  }

  async updateScrapingStatus(id: string, status: ArticleScrapingStatus, error?: string): Promise<ArticleDocument> {
    const article = await this.articleModel.findById(id);
    if (!article) {
      throw new Error(`Article not found with id: ${id}`);
    }

    article.scrapingStatus = status;
    article.lastScrapedAt = new Date();
    if (error) {
      article.scrapingError = error;
    }

    return article.save();
  }
}
