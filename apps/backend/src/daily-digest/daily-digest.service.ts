import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bullmq';
import { Cursor, Model, QueryOptions, Unpacked } from 'mongoose';
import { CreateDailyDigestDto } from './dto/create-daily-digest.dto';
import { UpdateDailyDigestDto } from './dto/update-daily-digest.dto';
import { DailyDigest, DailyDigestDocument, DigestStatus } from './schemas/daily-digest.schema';
import { DigestGenerationJobType, ProcessUserDigestJobData } from './types/queue.types';

@Injectable()
export class DailyDigestService {
  private readonly logger = new Logger(DailyDigestService.name);

  constructor(
    @InjectModel(DailyDigest.name) private readonly dailyDigestModel: Model<DailyDigestDocument>,
    @InjectQueue('daily-digest-generator') private readonly digestQueue: Queue,
  ) {}

  async create(createDailyDigestDto: CreateDailyDigestDto): Promise<DailyDigest> {
    this.logger.log('Creating new daily digest', createDailyDigestDto);
    const createdDigest = new this.dailyDigestModel(createDailyDigestDto);
    return createdDigest.save();
  }

  async findAll(): Promise<DailyDigest[]> {
    return this.dailyDigestModel.find().exec();
  }

  async findOne(id: string): Promise<DailyDigest> {
    const digest = await this.dailyDigestModel.findById(id).exec();
    if (!digest) {
      throw new NotFoundException(`Digest with ID ${id} not found`);
    }
    return digest;
  }

  async update(id: string, updateDailyDigestDto: UpdateDailyDigestDto): Promise<DailyDigest> {
    const updatedDigest = await this.dailyDigestModel.findByIdAndUpdate(id, updateDailyDigestDto, { new: true }).exec();
    if (!updatedDigest) {
      throw new NotFoundException(`Digest with ID ${id} not found`);
    }
    return updatedDigest;
  }

  async remove(id: string): Promise<DailyDigest | null> {
    return this.dailyDigestModel.findByIdAndDelete(id).exec();
  }

  async markDigestAsSent(id: string, channel: 'email' | 'whatsapp'): Promise<DailyDigest> {
    const updatedDigest = await this.dailyDigestModel
      .findByIdAndUpdate(
        id,
        {
          status: DigestStatus.SENT,
          channelSent: channel,
        },
        { new: true },
      )
      .exec();

    if (!updatedDigest) {
      throw new NotFoundException(`Digest with ID ${id} not found`);
    }
    return updatedDigest;
  }

  async markDigestAsFailed(id: string): Promise<DailyDigest> {
    const updatedDigest = await this.dailyDigestModel
      .findByIdAndUpdate(
        id,
        {
          status: DigestStatus.FAILED,
        },
        { new: true },
      )
      .exec();

    if (!updatedDigest) {
      throw new NotFoundException(`Digest with ID ${id} not found`);
    }
    return updatedDigest;
  }

  getPendingDigestsCursor(hour: string): Cursor<Unpacked<DailyDigestDocument>, QueryOptions<DailyDigestDocument>> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.dailyDigestModel
      .find({
        status: DigestStatus.PENDING,
        date: {
          $gte: today,
        },
      })
      .populate({
        path: 'userId',
        match: { digestTime: hour },
        select: '_id digestTime digestChannel',
      })
      .cursor();
  }

  async generateDigestForUser(userId: string): Promise<void> {
    this.logger.log(`Queuing digest generation for user ${userId}`);
    const jobData: ProcessUserDigestJobData = {
      type: DigestGenerationJobType.ProcessUserDigest,
      userId,
    };
    await this.digestQueue.add('process-user-digest', jobData);
  }

  async getLatestDigestForUser(userId: string): Promise<DailyDigest | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.dailyDigestModel
      .findOne({
        userId,
        date: { $gte: today },
      })
      .sort({ date: -1 })
      .lean<DailyDigest>()
      .exec();
  }
}
