export interface ArticleScrapingJobData {
  articleId: string;
  url: string;
}

export interface ArticleScrapingResult {
  success: boolean;
  contentLength?: number;
}
