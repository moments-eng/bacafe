import { JobsOptions } from 'bullmq';

/**
 * Represents the data structure for a notification delivery job
 */
export interface NotificationDeliveryJobData {
  userId: string;
  channel: 'whatsapp';
  messageType: 'digest';
  content: {
    teaserText: string;
  };
}

/**
 * Configuration for notification delivery attempts
 */
export const NOTIFICATION_JOB_OPTIONS: JobsOptions = {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 1000, // Initial delay of 1 second
  },
  removeOnComplete: true,
};
