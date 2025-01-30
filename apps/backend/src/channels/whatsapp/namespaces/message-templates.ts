import { Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import {
  CreateTemplateRequest,
  CreateTemplateResponse,
  DeleteTemplateParams,
  DeleteTemplateResponse,
  EditTemplateRequest,
  EditTemplateResponse,
  GetTemplatesParams,
  GetTemplatesResponse,
} from '../types/message-template-types';
import { WhatsAppConfig } from '../types/whatsapp-config';

export class MessageTemplates {
  private readonly logger = new Logger(MessageTemplates.name);

  constructor(
    private readonly axiosInstance: AxiosInstance,
    private readonly config: WhatsAppConfig,
    private readonly baseUrl: string,
  ) {}

  async createTemplate(template: CreateTemplateRequest): Promise<CreateTemplateResponse> {
    try {
      const response = await this.axiosInstance.post<CreateTemplateResponse>(
        `/${this.config.wabaId}/message_templates`,
        template,
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error creating template:', error);
      throw error;
    }
  }

  async getTemplates(params: GetTemplatesParams): Promise<GetTemplatesResponse> {
    try {
      const response = await this.axiosInstance.get<GetTemplatesResponse>(`/${this.config.wabaId}/message_templates`, {
        params,
      });
      return response.data;
    } catch (error) {
      this.logger.error('Error getting templates:', error);
      throw error;
    }
  }

  async editTemplate(templateId: string, template: EditTemplateRequest): Promise<EditTemplateResponse> {
    try {
      const response = await this.axiosInstance.post<EditTemplateResponse>(`/${templateId}`, template);
      return response.data;
    } catch (error) {
      this.logger.error('Error editing template:', error);
      throw error;
    }
  }

  async deleteTemplate(params: DeleteTemplateParams): Promise<DeleteTemplateResponse> {
    try {
      const response = await this.axiosInstance.delete<DeleteTemplateResponse>(
        `/${this.config.wabaId}/message_templates`,
        { params },
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error deleting template:', error);
      throw error;
    }
  }
}
