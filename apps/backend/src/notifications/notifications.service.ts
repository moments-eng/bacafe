import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { WhatsAppService } from '../channels/whatsapp/whatsapp.service';
import { UsersService } from '../users/users.service';
import { NotificationDeliveryJobData, NOTIFICATION_JOB_OPTIONS } from './types/notification-job.types';
import { BodyComponent, TemplateComponent } from '../channels/whatsapp/types/message-types';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectQueue('notification-delivery')
    private readonly notificationQueue: Queue<NotificationDeliveryJobData>,
    private readonly whatsappService: WhatsAppService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Enqueues a digest notification job for a specific user
   */
  async enqueueDigestNotification(userId: string, teaserText: string): Promise<void> {
    this.logger.debug(`Enqueueing digest notification for user ${userId}`);

    await this.notificationQueue.add(
      'digest-notification',
      {
        userId,
        channel: 'whatsapp',
        messageType: 'digest',
        content: {
          teaserText,
        },
      },
      NOTIFICATION_JOB_OPTIONS,
    );
  }

  /**
   * Sends a WhatsApp notification to a user
   */
  async sendWhatsAppNotification(userId: string, teaserText: string): Promise<void> {
    this.logger.debug(`Sending WhatsApp notification to user ${userId}`);

    const user = await this.usersService.findOne(userId);
    if (!user.phoneNumber || user.digestChannel !== 'whatsapp') {
      throw new Error(`User ${userId} not configured for WhatsApp notifications`);
    }

    const components: TemplateComponent[] = [
      {
        type: 'body',
        parameters: [{ type: 'text', text: teaserText }],
      } as BodyComponent,
    ];

    await this.whatsappService.sendTemplate(user.phoneNumber, 'daily_digest', components);
    this.logger.debug(`Successfully sent WhatsApp notification to user ${userId}`);
  }
}
