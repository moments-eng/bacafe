import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { format, utcToZonedTime } from 'date-fns-tz';
import { DigestService } from '../digest.service';

type DigestDeliveryJobData = {
  type: 'deliver_digests';
};

@Processor('digest-delivery')
export class DigestDeliveryProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(DigestDeliveryProcessor.name);
  private readonly timeZone = 'Asia/Jerusalem';

  constructor(
    @InjectQueue('digest-delivery') private readonly deliveryQueue: Queue<DigestDeliveryJobData>,
    private readonly digestService: DigestService,
  ) {
    super();
  }

  async onModuleInit() {
    this.logger.log('Initializing digest delivery processor');
    await this.deliveryQueue.upsertJobScheduler(
      'hourly-digest-delivery',
      { pattern: '0 * * * 0-4' },
      {
        name: 'deliver_digests',
        data: { type: 'deliver_digests' },
      },
    );
  }

  private getCurrentHourFormatted(): string {
    const now = new Date();
    const israelDate = utcToZonedTime(now, this.timeZone);
    return format(israelDate, 'HH:00', { timeZone: this.timeZone });
  }

  async process(): Promise<void> {
    const currentHour = this.getCurrentHourFormatted();
    this.logger.log(`Starting digest delivery for hour ${currentHour}`);

    try {
      await this.digestService.sendHourlyNotifications(currentHour);
      this.logger.log(`Completed digest delivery for hour ${currentHour}`);
    } catch (error) {
      this.logger.error('Failed to process hourly digest delivery', error instanceof Error ? error.stack : undefined);
      throw error;
    }
  }
}
