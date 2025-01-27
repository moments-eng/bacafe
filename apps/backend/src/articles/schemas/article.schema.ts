import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import type { Document, Types } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
  @ApiProperty({ description: 'Article ID' })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: false })
  content: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, index: true })
  source: string;

  @Prop()
  author?: string;

  @Prop()
  description?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ required: true })
  publishedAt: Date;

  @Prop({ required: true, unique: true })
  externalId: string;

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
