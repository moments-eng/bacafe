import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { Article } from '../../articles/schemas/article.schema';

export interface ArticleWithPosition {
  article: Types.ObjectId | Article;
  position: number;
}

export type OnboardingDocument = Onboarding & Document;

@Schema({ timestamps: true })
export class Onboarding {
  @ApiProperty({ description: 'Onboarding ID' })
  _id: Types.ObjectId;

  @Prop({
    type: [
      {
        article: { type: Types.ObjectId, ref: 'Article', required: true },
        position: { type: Number, required: true },
      },
    ],
    required: true,
    validate: [(val: any[]) => val.length > 0, 'At least one article is required'],
  })
  @ApiProperty({
    description: 'Articles with their positions in the onboarding flow',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        article: { type: 'string', description: 'Article ID' },
        position: { type: 'number', description: 'Order position in the flow', minimum: 1 },
      },
    },
  })
  articles: ArticleWithPosition[];

  @Prop({ default: false })
  @ApiProperty({ description: 'Whether this is the production version' })
  isProduction: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OnboardingSchema = SchemaFactory.createForClass(Onboarding);

OnboardingSchema.index({ isProduction: 1 }, { unique: true, partialFilterExpression: { isProduction: true } });
