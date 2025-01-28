import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { DailyDigestController } from './daily-digest.controller';
import { DailyDigestService } from './daily-digest.service';
import { DailyDigestDeliveryProcessor } from './processors/daily-digest-delivery.processor';
import { DailyDigestGeneratorProcessor } from './processors/daily-digest-generator.processor';
import { DailyDigest, DailyDigestSchema } from './schemas/daily-digest.schema';
import { DataService } from './services/data.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DailyDigest.name, schema: DailyDigestSchema }]),
    BullModule.registerQueue(
      {
        name: 'daily-digest-generator',
      },
      {
        name: 'daily-digest-delivery',
      },
    ),
    UsersModule,
    ConfigModule,
  ],
  controllers: [DailyDigestController],
  providers: [DailyDigestService, DailyDigestGeneratorProcessor, DailyDigestDeliveryProcessor, DataService],
  exports: [DailyDigestService],
})
export class DailyDigestModule {}
