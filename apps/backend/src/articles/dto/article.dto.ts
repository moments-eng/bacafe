import { ApiProperty } from '@nestjs/swagger';
import { Article } from '../schemas/article.schema';

export class ArticleDto {
  @ApiProperty({ description: 'Article ID' })
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  subtitle: string;

  @ApiProperty({ required: false })
  content?: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  source: string;

  @ApiProperty({ required: false })
  author?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ type: [String] })
  categories: string[];

  @ApiProperty()
  publishedAt: Date;

  @ApiProperty()
  externalId: string;

  @ApiProperty({ required: false, type: Object })
  enrichment?: Record<string, unknown>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  static fromSchema(article: Article): ArticleDto {
    return {
      id: article._id.toString(),
      title: article.title,
      subtitle: article.subtitle,
      content: article.content,
      url: article.url,
      source: article.source,
      author: article.author,
      description: article.description,
      imageUrl: article.imageUrl,
      categories: article.categories,
      publishedAt: article.publishedAt,
      externalId: article.externalId,
      enrichment: article.enrichment,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }
}
