import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { match } from 'ts-pattern';
import { UsersService } from '../../users/users.service';
import { DailyDigestService } from '../daily-digest.service';
import { DeliverUserDigestJobData, DigestDeliveryJobData, DigestDeliveryJobType } from '../types/queue.types';
import { DigestStatus } from '../schemas/daily-digest.schema';
import { WhatsAppService } from '../../channels/whatsapp/whatsapp.service';
import { BodyComponent, TemplateComponent } from '../../channels/whatsapp/types/message-types';

@Processor('daily-digest-delivery')
export class DailyDigestDeliveryProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(DailyDigestDeliveryProcessor.name);

  constructor(
    @InjectQueue('daily-digest-delivery') private readonly deliveryQueue: Queue<DigestDeliveryJobData>,
    private readonly dailyDigestService: DailyDigestService,
    private readonly usersService: UsersService,
    private readonly whatsappService: WhatsAppService,
  ) {
    super();
  }

  async onModuleInit() {
    await this.deliveryQueue.upsertJobScheduler(
      'hourly-digest-delivery',
      { pattern: '0 * * * *' },
      {
        name: DigestDeliveryJobType.QueueHourlyDeliveries,
        data: { type: DigestDeliveryJobType.QueueHourlyDeliveries },
      },
    );
  }

  async process(job: Job<DigestDeliveryJobData>): Promise<void> {
    this.logger.debug(`Processing job ${job.name} with data:`, job.data);

    await match(job.data)
      .with({ type: DigestDeliveryJobType.QueueHourlyDeliveries }, this.handleHourlyDeliveryQueue)
      .with({ type: DigestDeliveryJobType.DeliverUserDigest }, this.handleUserDigestDelivery)
      .exhaustive();
  }

  private handleHourlyDeliveryQueue = async (): Promise<void> => {
    const currentHour = new Date().getHours().toString().padStart(2, '0');
    this.logger.log(`Starting digest delivery queue for hour ${currentHour}`);
    const digestCursor = this.dailyDigestService.getPendingDigestsCursor(currentHour);

    try {
      for await (const digest of digestCursor) {
        if (!digest.userId) continue;

        const deliveryJob: DeliverUserDigestJobData = {
          type: DigestDeliveryJobType.DeliverUserDigest,
          userId: digest.userId._id.toString(),
        };

        await this.deliveryQueue.add(DigestDeliveryJobType.DeliverUserDigest, deliveryJob, {
          removeOnComplete: true,
          removeOnFail: { count: 1000, age: 1000 * 60 * 60 * 24 /* 1 day */ },
        });
      }
      this.logger.log(`Completed queueing digest deliveries for hour ${currentHour}`);
    } catch (error) {
      this.logger.error('Error during digest delivery queueing', error instanceof Error ? error.stack : undefined);
      throw error;
    } finally {
      await digestCursor.close();
    }
  };

  private handleUserDigestDelivery = async (data: DeliverUserDigestJobData): Promise<void> => {
    const { userId } = data;
    this.logger.debug(`Processing digest delivery for user ${userId}`);

    try {
      const digest = await this.dailyDigestService.getLatestDigestForUser(userId);
      if (!digest) {
        this.logger.debug(`No digest found for user ${userId}`);
        return;
      }

      if (digest.status !== DigestStatus.PENDING) {
        this.logger.debug(`Digest for user ${userId} is not in pending status`);
        return;
      }

      const user = await this.usersService.findOne(userId);

      if (user.digestChannel === 'whatsapp' && user.phoneNumber) {
        try {
          const components: TemplateComponent[] = [
            {
              type: 'body',
              parameters: [{ type: 'text', text: digest.content.teaser || '...' }],
            } as BodyComponent,
          ];

          await this.whatsappService.sendTemplate(user.phoneNumber, 'daily_digest', components);
          await this.dailyDigestService.markDigestAsSent(digest._id.toString(), 'whatsapp');
          this.logger.debug(`Successfully delivered WhatsApp digest to user ${userId}`);
          return;
        } catch (error) {
          this.logger.error(
            `Failed to send WhatsApp digest to user ${userId}`,
            error instanceof Error ? error.stack : undefined,
          );
          throw error;
        }
      }

      // Handle other channels here...
      await this.dailyDigestService.markDigestAsSent(digest._id.toString(), user.digestChannel);
      this.logger.debug(`Successfully delivered digest to user ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to deliver digest for user ${userId}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  };
}
