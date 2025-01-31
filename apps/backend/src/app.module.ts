import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { AppController } from './app.controller';
import { ArticleScrapingModule } from './article-scraping/article-scraping.module';
import { ArticlesModule } from './articles/articles.module';
import { DailyDigestModule } from './daily-digest/daily-digest.module';
import { FeedScrapingModule } from './feed-scraping/feed-scraping.module';
import { FeedsModule } from './feeds/feeds.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { QueuesModule } from './queues/queues.module';
import { ScrapersModule } from './scrapers/scrapers.module';
import { ArticleQueueModule } from './article-queue/article-queue.module';
import { EmailModule } from './emails/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScrapersModule,
    SentryModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? ''),
    ArticlesModule,
    ArticleScrapingModule,
    ArticleQueueModule,
    FeedsModule,
    QueuesModule,
    FeedScrapingModule,
    OnboardingModule,
    DailyDigestModule,
    EmailModule,
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
