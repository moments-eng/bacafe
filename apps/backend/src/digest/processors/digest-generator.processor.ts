import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { DataService } from '../services/data.service';

type DigestJobData = {
  type: 'generate_digest';
};

@Processor('digest-generator')
export class DigestGeneratorProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(DigestGeneratorProcessor.name);

  constructor(
    @InjectQueue('digest-generator') private readonly digestQueue: Queue<DigestJobData>,
    private readonly dataService: DataService,
  ) {
    super();
  }

  async onModuleInit() {
    this.logger.log('Initializing digest generator processor');
    // Schedule digest generation for 5 AM
    await this.digestQueue.upsertJobScheduler(
      'morning-digest-generation',
      { pattern: '0 7 * * *' },
      {
        name: 'generate_digest',
        data: { type: 'generate_digest' },
      },
    );

    // Schedule digest generation for 12 PM
    await this.digestQueue.upsertJobScheduler(
      'noon-digest-generation',
      { pattern: '0 10 * * *' },
      {
        name: 'generate_digest',
        data: { type: 'generate_digest' },
      },
    );

    // Schedule digest generation for 6 PM
    await this.digestQueue.upsertJobScheduler(
      'evening-digest-generation',
      { pattern: '0 16 * * *' },
      {
        name: 'generate_digest',
        data: { type: 'generate_digest' },
      },
    );
  }

  async process(): Promise<void> {
    this.logger.log(`Processing digest generation job at ${new Date().toISOString()}`);

    try {
      const response = await this.dataService.generateBatchDigest();
      this.logger.log('Successfully triggered batch digest generation', response);
    } catch (error) {
      this.logger.error('Failed to generate batch digest', error instanceof Error ? error.stack : undefined);
      throw error;
    }
  }
}
