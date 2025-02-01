import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DigestGenerationResponse } from '../types/queue.types';
import { extractErrorMessage } from '../../utils/error';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  constructor(private readonly configService: ConfigService) {}

  async generateDailyDigest(readerId: string): Promise<DigestGenerationResponse> {
    const dataBackendUrl = this.configService.get<string>('DATA_BACKEND_URL');
    if (!dataBackendUrl) {
      throw new Error('DATA_BACKEND_URL is not configured');
    }

    try {
      this.logger.log(`Generating daily digest for reader ${readerId}`);
      const response = await axios.post<DigestGenerationResponse>(`${dataBackendUrl}/api/daily-digest`, {
        reader_id: readerId,
      });
      this.logger.log(`Successfully generated daily digest for reader ${readerId}`);
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to generate daily digest for reader ${readerId}: ${extractErrorMessage(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new Error(`Failed to generate daily digest: ${extractErrorMessage(error)}`);
    }
  }
}
