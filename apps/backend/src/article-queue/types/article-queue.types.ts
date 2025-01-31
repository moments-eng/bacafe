export interface ArticleQueueJobData {
  articleId: string;
  url: string;
}

export interface ArticleQueueResult {
  success: boolean;
  contentLength?: number;
}
