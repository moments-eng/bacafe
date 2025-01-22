import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
	FeedChannel,
	FeedChannelSchema,
} from 'src/feeds/schemas/feed-channel.schema';
import { FeedChannelRepository } from './feed-channel.repository';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: FeedChannel.name, schema: FeedChannelSchema },
		]),
	],
	providers: [FeedChannelRepository],
	exports: [FeedChannelRepository],
})
export class FeedChannelModule {}
