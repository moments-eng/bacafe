import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DigestDocument = Digest & Document;

@Schema({
  timestamps: true,
  collection: 'digests',
})
export class Digest {
  _id: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  teaser: string;

  @Prop({ type: [String], required: true })
  highlights: string[];

  @Prop({ type: [String], required: true })
  body: string[];

  @Prop({ type: [String], required: true })
  articleLinks: string[];

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  readTime?: number;

  @Prop({ type: String, enum: ['positive', 'negative', 'neutral'] })
  mood?: 'positive' | 'negative' | 'neutral';
}

export const DigestSchema = SchemaFactory.createForClass(Digest);

// Add index for date-based queries
DigestSchema.index({ date: -1 });
