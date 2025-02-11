import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { ArticleQueueModule } from './article-queue/article-queue.module';
import { ArticleScrapingModule } from './article-scraping/article-scraping.module';
import { ArticlesModule } from './articles/articles.module';
import { EmailModule } from './emails/email.module';
import { FeedScrapingModule } from './feed-scraping/feed-scraping.module';
import { FeedsModule } from './feeds/feeds.module';
import { loggerOptions } from './logger/logger';
import { OnboardingModule } from './onboarding/onboarding.module';
import { QueuesModule } from './queues/queues.module';
import { ScrapersModule } from './scrapers/scrapers.module';
import { DigestModule } from './digest/digest.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScrapersModule,
    SentryModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? ''),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const coralogixApiKey = configService.get<string>('CORALOGIX_API_KEY') || '';
        const host = configService.get<string>('HOSTNAME') || 'unknown';
        return loggerOptions({ coralogixApiKey, host });
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    ArticlesModule,
    ArticleScrapingModule,
    ArticleQueueModule,
    FeedsModule,
    QueuesModule,
    FeedScrapingModule,
    OnboardingModule,
    DigestModule,
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
