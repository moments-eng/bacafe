export enum DigestDeliveryJobType {
  QueueHourlyDeliveries = 'queueHourlyDeliveries',
  DeliverUserDigest = 'deliverUserDigest',
}

export enum DigestGenerationJobType {
  GenerateDailyDigest = 'generateDailyDigest',
  ProcessUserDigest = 'processUserDigest',
}

export interface GenerateDailyDigestJobData {
  type: DigestGenerationJobType.GenerateDailyDigest;
}

export interface ProcessUserDigestJobData {
  type: DigestGenerationJobType.ProcessUserDigest;
  userId: string;
}

export interface QueueHourlyDeliveriesJobData {
  type: DigestDeliveryJobType.QueueHourlyDeliveries;
}

export interface DeliverUserDigestJobData {
  type: DigestDeliveryJobType.DeliverUserDigest;
  userId: string;
}

export type DailyDigestJobData = GenerateDailyDigestJobData | ProcessUserDigestJobData;

export type DigestDeliveryJobData = QueueHourlyDeliveriesJobData | DeliverUserDigestJobData;

export interface Section {
  category: string;
  title: string;
  teaser: string;
  highlights: string[];
  body: string[];
  articleLinks: string[];
  imageUrl: string;
  readTime?: number;
  mood?: 'positive' | 'negative' | 'neutral';
}

export interface DigestGenerationResponse {
  sections: Section[];
  teaser: string;
  date: string;
  readTime: number;
}
