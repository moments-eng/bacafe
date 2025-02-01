import { Injectable, Logger } from '@nestjs/common';
import { WhatsAppClient } from './whatsapp.client';
import { TemplateComponent } from './types/message-types';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);

  constructor(private readonly whatsappClient: WhatsAppClient) {}

  public async sendTemplate(phoneNumber: string, templateName: string, components: TemplateComponent[] = []) {
    try {
      this.logger.log(`Sending WhatsApp template ${templateName} to ${phoneNumber}`);
      await this.whatsappClient.sendTemplate(phoneNumber, templateName, 'he', components);
      this.logger.log(`Successfully sent WhatsApp template ${templateName} to ${phoneNumber}`);
    } catch (error) {
      this.logger.error(
        `Failed to send WhatsApp template ${templateName} to ${phoneNumber}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
