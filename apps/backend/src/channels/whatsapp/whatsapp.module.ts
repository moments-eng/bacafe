import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WHATSAPP_CONFIG, WHATSAPP_HTTP_CLIENT, WhatsAppConfig } from './types/whatsapp-config';
import { WhatsAppClient } from './whatsapp.client';
import { WhatsAppService } from './whatsapp.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: WHATSAPP_CONFIG,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): WhatsAppConfig => ({
        wabaId: configService.getOrThrow<string>('WHATSAPP_WABA_ID'),
        phoneNumberId: configService.getOrThrow<string>('WHATSAPP_PHONE_NUMBER_ID'),
        accessToken: configService.getOrThrow<string>('WHATSAPP_ACCESS_TOKEN'),
        baseUrl: 'https://graph.facebook.com/v20.0',
      }),
    },
    {
      provide: WHATSAPP_HTTP_CLIENT,
      inject: [WHATSAPP_CONFIG],
      useFactory: (config: WhatsAppConfig) => {
        return axios.create({
          baseURL: config.baseUrl,
          headers: {
            Authorization: `Bearer ${config.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      },
    },
    WhatsAppService,
    WhatsAppClient,
  ],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
