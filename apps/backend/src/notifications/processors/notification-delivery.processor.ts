import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationsService } from '../notifications.service';
import { NotificationDeliveryJobData } from '../types/notification-job.types';

@Processor('notification-delivery')
export class NotificationDeliveryProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationDeliveryProcessor.name);

  constructor(private readonly notificationsService: NotificationsService) {
    super();
  }

  async process(job: Job<NotificationDeliveryJobData>): Promise<void> {
    this.logger.debug(`Processing notification job ${job.id} for user ${job.data.userId}`);

    try {
      switch (job.data.channel) {
        case 'whatsapp':
          await this.notificationsService.sendWhatsAppNotification(job.data.userId, job.data.content.teaserText);
          break;
        default:
          throw new Error(`Unsupported notification channel: ${job.data.channel}`);
      }

      this.logger.debug(`Successfully processed notification job ${job.id} for user ${job.data.userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to process notification job ${job.id} for user ${job.data.userId}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error; // Re-throw to trigger retry mechanism
    }
  }
}
