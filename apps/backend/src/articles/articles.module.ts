import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesService } from './articles.service';
import { Article, ArticleSchema } from './schemas/article.schema';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
	],
	providers: [ArticlesService],
	exports: [ArticlesService],
})
export class ArticlesModule {}
