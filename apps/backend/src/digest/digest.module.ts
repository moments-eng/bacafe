import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DigestController } from './digest.controller';
import { DigestService } from './digest.service';
import { Digest, DigestSchema } from './schemas/digest.schema';
import { DataService } from './services/data.service';
import { UsersModule } from '../users/users.module';
import { WhatsAppModule } from '../channels/whatsapp/whatsapp.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Digest.name, schema: DigestSchema }]),
    UsersModule,
    WhatsAppModule,
    ConfigModule,
  ],
  controllers: [DigestController],
  providers: [DigestService, DataService],
  exports: [DigestService],
})
export class DigestModule {}
