import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { match } from 'ts-pattern';
import { UsersService } from '../../users/users.service';
import { DailyDigestService } from '../daily-digest.service';
import { DataService } from '../services/data.service';
import { DailyDigestJobData, DigestGenerationJobType, ProcessUserDigestJobData } from '../types/queue.types';

@Processor('daily-digest-generator')
export class DailyDigestGeneratorProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(DailyDigestGeneratorProcessor.name);

  constructor(
    @InjectQueue('daily-digest-generator') private readonly digestQueue: Queue<DailyDigestJobData>,
    private readonly dailyDigestService: DailyDigestService,
    private readonly dataService: DataService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async onModuleInit() {
    await this.digestQueue.upsertJobScheduler(
      'daily-digest-generation',
      { pattern: '0 3 * * *' },
      {
        name: DigestGenerationJobType.GenerateDailyDigest,
        data: { type: DigestGenerationJobType.GenerateDailyDigest },
      },
    );
  }

  async process(job: Job<DailyDigestJobData>): Promise<void> {
    this.logger.debug(`Processing job ${job.name} with data:`, job.data);

    await match(job.data)
      .with({ type: DigestGenerationJobType.GenerateDailyDigest }, this.handleDailyDigestGeneration)
      .with({ type: DigestGenerationJobType.ProcessUserDigest }, this.handleUserDigestGeneration)
      .exhaustive();
  }

  private handleDailyDigestGeneration = async (): Promise<void> => {
    this.logger.log('Starting daily digest generation');
    const userCursor = this.usersService.getUserCursor();

    try {
      for await (const user of userCursor) {
        const processJob: ProcessUserDigestJobData = {
          type: DigestGenerationJobType.ProcessUserDigest,
          userId: user._id.toString(),
        };

        await this.digestQueue.add(DigestGenerationJobType.ProcessUserDigest, processJob, {
          removeOnComplete: true,
          removeOnFail: { count: 1000, age: 1000 * 60 * 60 * 24 /* 1 day */ },
        });
      }
      this.logger.log('Completed queueing all user digest generations');
    } catch (error) {
      this.logger.error(
        'Error during user digest generation queueing',
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    } finally {
      await userCursor.close();
    }
  };

  private handleUserDigestGeneration = async (data: ProcessUserDigestJobData): Promise<void> => {
    const { userId } = data;
    this.logger.debug(`Processing digest generation for user ${userId}`);

    try {
      const existingDigest = await this.dailyDigestService.getLatestDigestForUser(userId);
      if (existingDigest) {
        this.logger.debug(`Digest already exists for user ${userId}`);
        return;
      }

      const digestContent = await this.dataService.generateDailyDigest(userId);

      await this.dailyDigestService.create({
        userId,
        date: new Date(),
        content: digestContent,
      });

      this.logger.debug(`Successfully created digest for user ${userId}`);
    } catch (error) {
      this.logger.error(
        `Failed to generate digest for user ${userId}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  };
}
