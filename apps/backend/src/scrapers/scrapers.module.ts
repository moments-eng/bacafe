import { Module } from '@nestjs/common';
import { ArticlesModule } from '../articles/articles.module';
import { FeedsModule } from '../feeds/feeds.module';

@Module({
	imports: [ArticlesModule, FeedsModule],
	providers: [],
	exports: [],
})
export class ScrapersModule {}
