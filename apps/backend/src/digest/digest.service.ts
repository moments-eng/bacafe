import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Digest, DigestDocument } from './schemas/digest.schema';
import { DataService } from './services/data.service';
import { WhatsAppService } from '../channels/whatsapp/whatsapp.service';
import { UsersService } from '../users/users.service';
import { BodyComponent, TemplateComponent } from '../channels/whatsapp/types/message-types';
import { User } from '../users/schemas/user.schema';
import { QueryDigestDto } from './dto/query-digest.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class DigestService {
  private readonly logger = new Logger(DigestService.name);

  constructor(
    @InjectModel(Digest.name) private readonly digestModel: Model<DigestDocument>,
    private readonly dataService: DataService,
    private readonly whatsappService: WhatsAppService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findOne(id: string): Promise<Digest> {
    this.logger.debug(`Finding digest by ID: ${id}`);
    const digest = await this.digestModel.findById(id).exec();
    if (!digest) {
      this.logger.warn(`Digest with ID ${id} not found`);
      throw new NotFoundException(`Digest with ID ${id} not found`);
    }
    return digest;
  }

  async findManyByIds(ids: string[]): Promise<Digest[]> {
    this.logger.debug(`Finding digests by IDs: ${ids.join(', ')}`);
    const digests = await this.digestModel.find({ _id: { $in: ids } }).exec();
    this.logger.debug(`Found ${digests.length} digests out of ${ids.length} requested`);
    return digests;
  }

  async remove(id: string): Promise<Digest | null> {
    this.logger.debug(`Removing digest with ID: ${id}`);
    return this.digestModel.findByIdAndDelete(id).exec();
  }

  async triggerCreation(): Promise<void> {
    this.logger.debug('Triggering digest creation in data-backend service');
    await this.dataService.generateBatchDigest();
  }

  async sendUserNotification(userId: string): Promise<void> {
    this.logger.debug(`Preparing digest notification for user ${userId}`);
    const user = await this.usersService.findOne(userId);
    this.validateUserNotificationSetup(user);

    const teaserText = await this.assembleUserDigestTeaser(userId);
    await this.notificationsService.enqueueDigestNotification(userId, teaserText);

    this.logger.log(`Successfully enqueued notification for user ${userId}`);
  }

  async sendHourlyNotifications(currentHour: string): Promise<void> {
    this.logger.debug(`Starting notifications for hour ${currentHour}`);
    const users = await this.usersService.findByDigestTime(currentHour);
    this.logger.log(`Processing notifications for ${users.length} users`);

    await Promise.all(
      users.map(async (user) => {
        try {
          await this.sendUserNotification(user._id.toString());
        } catch (error) {
          this.logger.error(
            `Failed to enqueue notification for user ${user._id.toString()}`,
            error instanceof Error ? error.stack : undefined,
          );
        }
      }),
    );
  }

  private validateUserNotificationSetup(user: User): void {
    if (user.digestChannel !== 'whatsapp' || !user.phoneNumber) {
      this.logger.warn(`User ${user._id.toString()} not configured for WhatsApp notifications`);
      throw new NotFoundException('User not configured for WhatsApp notifications');
    }
  }

  private async assembleUserDigestTeaser(userId: string): Promise<string> {
    const digestIds = await this.dataService.getUserDigestIds(userId);
    if (!digestIds?.length) {
      this.logger.warn(`No digests found for user ${userId}`);
      throw new NotFoundException('No digests available for user');
    }

    const digestsToProcess = digestIds.slice(0, 3);
    const digests = await this.findManyByIds(digestsToProcess);

    const teaserText = this.assembleTeaserFromDigests(digests);
    if (!teaserText) {
      this.logger.warn(`No valid teasers found for user ${userId}`);
      throw new NotFoundException('No valid digest content available');
    }

    return teaserText;
  }

  private assembleTeaserFromDigests(digests: Digest[]): string {
    return digests
      .filter((digest) => digest?.teaser)
      .map((digest) => digest.teaser)
      .join(', ');
  }

  /**
   * Queries digests based on the provided criteria.
   * @param queryDto Query parameters including ids and pagination info.
   * @returns An object containing an array of digests and the total count.
   */
  async queryDigests(queryDto: QueryDigestDto): Promise<{ items: Digest[]; total: number }> {
    const filter: Record<string, unknown> = {};
    if (queryDto.ids && queryDto.ids.length > 0) {
      filter._id = { $in: queryDto.ids };
    }
    const page: number = queryDto.page || 1;
    const limit: number = queryDto.limit || 10;
    const skip: number = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.digestModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.digestModel.countDocuments(filter),
    ]);
    return { items, total };
  }
}
