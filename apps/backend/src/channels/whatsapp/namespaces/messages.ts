import { Logger } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { SendMessageParams, WhatsAppResponse } from '../types/message-types';

export class MessagesFacade {
  private static readonly logger = new Logger(MessagesFacade.name);

  static async sendMessage(
    phoneNumberId: string,
    httpClient: AxiosInstance,
    params: SendMessageParams,
  ): Promise<WhatsAppResponse> {
    const url = `${phoneNumberId}/messages`;
    const data = {
      messaging_product: 'whatsapp',
      recipient_type: params.recipient_type || 'individual',
      ...params,
    };
    MessagesFacade.logger.log('Sending WhatsApp message:', data);
    try {
      const response = await httpClient.post<WhatsAppResponse>(url, data);
      MessagesFacade.logger.log('WhatsApp message sent. Response:', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      MessagesFacade.logger.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }
}
