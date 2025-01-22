import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ArticlesModule } from './articles/articles.module';
import { FeedScrapingModule } from './feed-scraping/feed-scraping.module';
import { FeedsModule } from './feeds/feeds.module';
import { QueuesModule } from './queues/queues.module';
import { ScrapersModule } from './scrapers/scrapers.module';
import { SentryModule, SentryGlobalFilter } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';

@Module({
	imports: [
		ConfigModule.forRoot(),
		ScrapersModule,
		SentryModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGODB_URI ?? ''),
		ArticlesModule,
		FeedsModule,
		QueuesModule,
		FeedScrapingModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_FILTER,
			useClass: SentryGlobalFilter,
		},
	],
})
export class AppModule {}
