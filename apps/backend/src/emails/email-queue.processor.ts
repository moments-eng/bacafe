import { WorkerHost, Processor } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { match } from 'ts-pattern';
import { EmailJob } from './types/email-job.types';
import { EmailService } from './email.service';
import ApprovalEmail from './templates/approval.email';
import { extractErrorMessage } from '../utils/error';

@Processor('email-queue')
export class EmailQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailQueueProcessor.name);

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<EmailJob>): Promise<void> {
    const { data } = job;
    this.logger.log(`Processing email job: ${job.id} of type: ${data.type}`);

    try {
      const emailContent = match(data)
        .with({ type: 'user-approved' }, (job) => ({
          subject: 'ברוכים הבאים לבול בפוני! 🎉',
          react: ApprovalEmail({ username: job.data.username }),
        }))
        .with({ type: 'daily-digest' }, () => {
          throw new Error('Daily digest email not implemented yet');
        })
        .with({ type: 'welcome' }, () => {
          throw new Error('Welcome email not implemented yet');
        })
        .exhaustive();

      const response = await this.emailService.sendEmail({
        to: data.to,
        ...emailContent,
      });
      this.logger.log('Response from Resend', response);

      this.logger.log(`Successfully sent ${data.type} email to ${data.to}`);
    } catch (error) {
      this.logger.error(`Failed to process email job ${job.id} of type ${data.type}: ${extractErrorMessage(error)}`);
      throw error;
    }
  }
}
