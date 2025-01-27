import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { extractErrorMessage } from 'src/utils/error';

interface EnrichmentRequest {
  title: string;
  subtitle: string;
  content: string;
}

@Injectable()
export class EnrichmentService {
  constructor(private readonly configService: ConfigService) {}

  async enrichArticle(data: EnrichmentRequest): Promise<Record<string, unknown>> {
    const dataBackendUrl = this.configService.get<string>('DATA_BACKEND_URL');
    if (!dataBackendUrl) {
      throw new Error('DATA_BACKEND_URL is not configured');
    }

    try {
      const response = await axios.post(`${dataBackendUrl}/api/ingest-article`, data);
      return response.data as Record<string, unknown>;
    } catch (error) {
      throw new Error(`Failed to enrich article: ${extractErrorMessage(error)}`);
    }
  }
}
