export interface FeedScrapingJobData {
	feedId: string;
	url: string;
	provider: string;
}

export interface FeedScrapingResult {
	processedArticles: number;
	newArticles: number;
}
