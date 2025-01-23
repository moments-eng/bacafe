import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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
            return response.data;
        } catch (error) {
            throw new Error(`Failed to enrich article: ${error.message}`);
        }
    }
} 