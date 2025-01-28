import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyDigestDto } from './create-daily-digest.dto';

export class UpdateDailyDigestDto extends PartialType(CreateDailyDigestDto) {}
