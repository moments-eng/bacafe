import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Article, type ArticleDocument } from './schemas/article.schema';
import { ArticleFilterDto, ArticleSortDto } from './dto/query-articles.dto';
import { ArticleStatsDto } from './dto/article-stats.dto';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

  async create(article: Partial<Article>): Promise<ArticleDocument> {
    try {
      const newArticle = new this.articleModel(article);
      return await newArticle.save();
    } catch (error) {
      this.logger.error(`Failed to create article: ${error}`);
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
      this.logger.error(`Failed to query articles: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
}
