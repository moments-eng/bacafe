import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { FeedDto } from '../dto/feed.dto';

export type FeedChannelDocument = FeedChannel & Document;

@Schema({ timestamps: true })
export class FeedChannel {
  @ApiProperty({ description: 'Feed ID' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'The name of the feed' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'The RSS feed URL' })
  @Prop({ required: true, unique: true, index: true })
  url: string;

  @ApiProperty({ description: 'The news provider name' })
  @Prop({ required: true })
  provider: string;

  @ApiProperty({ description: 'The feed language' })
  @Prop({ required: true })
  language: string;

  @ApiProperty({ description: 'Whether the feed is active', default: true })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Feed categories', type: [String] })
  @Prop({ type: [String], default: [] })
  categories: string[];

  @ApiProperty({ description: 'Feed description', required: false })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'Scraping interval in minutes',
    default: 5,
  })
  @Prop({ default: 5 })
  scrapingInterval: number;

  @ApiProperty({ description: 'Last scraping timestamp' })
  @Prop({ type: Date })
  lastScrapedAt?: Date;

  toDto(): FeedDto {
    return {
      id: this._id.toString(),
      name: this.name,
      url: this.url,
      provider: this.provider,
      language: this.language,
      isActive: this.isActive,
      categories: this.categories,
      description: this.description,
      scrapingInterval: this.scrapingInterval,
      lastScrapedAt: this.lastScrapedAt,
    };
  }
}

export const FeedChannelSchema = SchemaFactory.createForClass(FeedChannel);

// Create a unique index on the url field
FeedChannelSchema.index({ url: 1 }, { unique: true });

// Add the toDto method to the schema
FeedChannelSchema.methods.toDto = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    url: this.url,
    provider: this.provider,
    language: this.language,
    isActive: this.isActive,
    categories: this.categories,
    description: this.description,
    scrapingInterval: this.scrapingInterval,
    lastScrapedAt: this.lastScrapedAt,
  };
};
