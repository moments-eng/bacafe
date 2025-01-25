import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { Onboarding, OnboardingSchema } from './schemas/onboarding.schema';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Onboarding.name, schema: OnboardingSchema }]), ArticlesModule],
  controllers: [OnboardingController],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
