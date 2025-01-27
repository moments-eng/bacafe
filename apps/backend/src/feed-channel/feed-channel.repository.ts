import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FeedChannel, FeedChannelDocument } from '../feeds/schemas/feed-channel.schema';
import { UpdateFeedDto } from '../feeds/dto/update-feed.dto';

@Injectable()
export class FeedChannelRepository {
  constructor(
    @InjectModel(FeedChannel.name)
    private feedChannelModel: Model<FeedChannelDocument>,
  ) {}

  async create(feedChannel: Partial<FeedChannel>): Promise<FeedChannel> {
    const newFeedChannel = new this.feedChannelModel(feedChannel);
    return await newFeedChannel.save();
  }

  async findAll(): Promise<FeedChannel[]> {
    return this.feedChannelModel.find().exec();
  }

  async findByProvider(provider: string): Promise<FeedChannel[]> {
    return this.feedChannelModel.find({ provider, isActive: true }).exec();
  }

  async updateLastScrapedAt(id: string): Promise<void> {
    const updated = await this.feedChannelModel
      .findByIdAndUpdate(id, { lastScrapedAt: new Date() }, { new: true })
      .exec();

    if (!updated) {
      throw new Error('Feed not found');
    }
  }

  async findDueForScraping(): Promise<FeedChannel[]> {
    const now = new Date();
    return this.feedChannelModel
      .find({
        isActive: true,
        $or: [
          { lastScrapedAt: { $exists: false } },
          {
            $expr: {
              $gt: [
                { $subtract: [now, '$lastScrapedAt'] },
                { $multiply: ['$scrapingInterval', 60 * 1000] }, // Convert minutes to milliseconds
              ],
            },
          },
        ],
      })
      .exec();
  }

  async findByUrl(url: string): Promise<FeedChannel | null> {
    return this.feedChannelModel.findOne({ url }).exec();
  }

  async upsertByUrl(url: string, feedChannel: Partial<FeedChannel>): Promise<FeedChannel> {
    return this.feedChannelModel
      .findOneAndUpdate(
        { url },
        { $setOnInsert: feedChannel },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      )
      .exec();
  }

  async updateFeedStatus(id: string, isActive: boolean, scrapingInterval?: number): Promise<FeedChannel> {
    const update: Partial<FeedChannel> = { isActive };
    if (scrapingInterval !== undefined) {
      update.scrapingInterval = scrapingInterval;
    }

    const updated = await this.feedChannelModel.findByIdAndUpdate(id, update, { new: true }).exec();

    if (!updated) {
      throw new Error('Feed not found');
    }

    return updated;
  }

  async findById(id: string): Promise<FeedChannel> {
    const feed = await this.feedChannelModel.findById(id).exec();
    if (!feed) {
      throw new Error('Feed not found');
    }
    return feed;
  }

  async delete(id: string): Promise<void> {
    const result = await this.feedChannelModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new Error('Feed not found');
    }
  }

  async updateFeed(id: string, updateFeedDto: UpdateFeedDto): Promise<FeedChannel> {
    const update: Partial<FeedChannel> = {
      ...(updateFeedDto.isActive !== undefined && { isActive: updateFeedDto.isActive }),
      ...(updateFeedDto.scrapingInterval !== undefined && { scrapingInterval: updateFeedDto.scrapingInterval }),
      ...(updateFeedDto.name && { name: updateFeedDto.name }),
      ...(updateFeedDto.categories && { categories: updateFeedDto.categories }),
    };

    const updated = await this.feedChannelModel.findByIdAndUpdate(id, update, { new: true }).exec();

    if (!updated) {
      throw new Error('Feed not found');
    }

    return updated;
  }
}
