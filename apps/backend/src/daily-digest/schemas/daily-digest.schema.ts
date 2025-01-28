import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type DailyDigestDocument = DailyDigest & Document;

export interface Section {
  category: string;
  title: string;
  teaser: string;
  highlights: string[];
  body: string[];
  articleLinks: string[];
  imageUrl: string;
  readTime?: number;
  mood?: 'positive' | 'negative' | 'neutral';
}

export interface DigestContent {
  sections: Section[];
  teaser: string;
  date: string;
  readTime: number;
}

export enum DigestStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

export type DigestChannel = 'email' | 'whatsapp';

@Schema({
  timestamps: true,
  collection: 'daily_digests',
})
export class DailyDigest {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ type: Object, required: true })
  content: DigestContent;

  @Prop({ enum: DigestStatus, default: DigestStatus.PENDING })
  status: DigestStatus;

  @Prop({ type: String, enum: ['email', 'whatsapp'] })
  channelSent?: DigestChannel;
}

export const DailyDigestSchema = SchemaFactory.createForClass(DailyDigest);

// Add indexes after schema creation
DailyDigestSchema.index({ userId: 1, date: -1 });
DailyDigestSchema.index({ status: 1, date: -1 });
DailyDigestSchema.index({ status: 1, date: -1, userId: 1 });
