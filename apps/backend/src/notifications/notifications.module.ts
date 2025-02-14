import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsService } from './notifications.service';
import { NotificationDeliveryProcessor } from './processors/notification-delivery.processor';
import { WhatsAppModule } from '../channels/whatsapp/whatsapp.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notification-delivery',
    }),
    WhatsAppModule,
    UsersModule,
  ],
  providers: [NotificationsService, NotificationDeliveryProcessor],
  exports: [NotificationsService],
})
export class NotificationsModule {}
