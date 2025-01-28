import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { DigestContent, DigestStatus } from '../schemas/daily-digest.schema';

export class CreateDailyDigestDto {
  @IsMongoId()
  userId: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsObject()
  @IsNotEmpty()
  content: DigestContent;

  @IsEnum(DigestStatus)
  status?: DigestStatus = DigestStatus.PENDING;
}
