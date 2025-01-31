import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { EmailJob } from './types/email-job.types';

@Injectable()
export class EmailQueueService {
  constructor(
    @InjectQueue('email-queue')
    private readonly emailQueue: Queue<EmailJob>,
  ) {}

  /**
   * Adds an email job to the queue
   * @param job The email job to add to the queue
   * @returns A promise that resolves when the job is added
   */
  public async addEmailJob(job: EmailJob) {
    await this.emailQueue.add('send-email', job);
  }
}
