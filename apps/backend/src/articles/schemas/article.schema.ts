import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class ArticleImage {
  @Prop({ required: true })
  url: string;

  @Prop()
  credit?: string;
}

export enum ArticleScrapingStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Schema({ timestamps: true })
export class Article {
  _id: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, index: true })
  source: string;

  @Prop({ required: true, unique: true })
  externalId: string;

  @Prop({
    type: String,
    enum: ArticleScrapingStatus,
    default: ArticleScrapingStatus.PENDING,
    index: true,
  })
  scrapingStatus: ArticleScrapingStatus;

  @Prop()
  lastScrapedAt?: Date;

  @Prop()
  scrapingError?: string;

  @Prop()
  title?: string;

  @Prop()
  subtitle?: string;

  @Prop()
  content?: string;

  @Prop()
  author?: string;

  @Prop()
  description?: string;

  @Prop({ type: ArticleImage })
  image?: ArticleImage;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop()
  publishedAt?: Date;

  @Prop({ type: Object, index: true })
  enrichment?: Record<string, unknown>;

  @Prop({ type: [Number], default: [] })
  embeddings: number[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
