import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { MessagesFacade } from './namespaces/messages';
import { SendMessageParams, TemplateComponent } from './types/message-types';
import { WHATSAPP_CONFIG, WHATSAPP_HTTP_CLIENT, WhatsAppConfig } from './types/whatsapp-config';

@Injectable()
export class WhatsAppClient {
  constructor(
    @Inject(WHATSAPP_CONFIG) private readonly config: WhatsAppConfig,
    @Inject(WHATSAPP_HTTP_CLIENT) private readonly httpClient: AxiosInstance,
  ) {}

  public async sendTemplate(
    to: string,
    templateName: string,
    language: string,
    components: TemplateComponent[] = [],
  ): Promise<void> {
    const messageParams: SendMessageParams = {
      to,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: language,
        },
        components,
      },
    };
    await MessagesFacade.sendMessage(this.config.phoneNumberId, this.httpClient, messageParams);
  }
}
