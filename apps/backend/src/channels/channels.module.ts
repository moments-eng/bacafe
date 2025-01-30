import { Module } from '@nestjs/common';
import { WhatsAppModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [WhatsAppModule],
  exports: [WhatsAppModule],
})
export class ChannelsModule {}
