import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	imports: [
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				connection: {
					host: configService.get('REDIS_HOST', 'localhost'),
					port: configService.get('REDIS_PORT', 6379),
				},
				defaultJobOptions: {
					removeOnComplete: true,
					removeOnFail: {
						age: 1000 * 60 * 60 * 24,
					},
				},
			}),
			inject: [ConfigService],
		}),
	],
	exports: [BullModule],
})
export class QueuesModule {}
