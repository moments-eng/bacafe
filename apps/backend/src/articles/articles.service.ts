import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, type ArticleDocument } from './schemas/article.schema';

@Injectable()
export class ArticlesService {
	private readonly logger = new Logger(ArticlesService.name);

	constructor(
		@InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
	) {}

	async create(article: Partial<Article>): Promise<ArticleDocument> {
		try {
			const newArticle = new this.articleModel(article);
			return await newArticle.save();
		} catch (error) {
			this.logger.error(`Failed to create article: ${error.message}`);
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
	async update(
		id: string,
		updateData: Partial<Article>,
	): Promise<ArticleDocument | null> {
		return this.articleModel.findByIdAndUpdate(id, updateData, {
			new: true, // Return the updated document
		});
	}
}
