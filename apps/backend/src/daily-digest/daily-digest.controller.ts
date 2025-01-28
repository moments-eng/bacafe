import { Controller, Get, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DailyDigestService } from './daily-digest.service';
import { DigestContentDto } from './dto/digest-content.dto';

@ApiTags('Daily Digest')
@Controller('daily-digest')
export class DailyDigestController {
  constructor(private readonly dailyDigestService: DailyDigestService) {}

  @Post('trigger/:userId')
  @ApiOperation({
    operationId: 'triggerDailyDigest',
    summary: 'Trigger daily digest generation for a user',
    description: 'Admin-only endpoint to manually trigger daily digest generation for testing purposes',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Daily digest generation has been queued',
  })
  async triggerDailyDigest(@Param('userId') userId: string): Promise<void> {
    await this.dailyDigestService.generateDigestForUser(userId);
  }

  @Get(':userId/latest')
  @ApiOperation({
    operationId: 'getLatestDailyDigest',
    summary: 'Get latest daily digest for a user',
    description: 'Retrieves the most recent daily digest for the specified user from today',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Latest daily digest retrieved successfully',
    type: DigestContentDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No digest found for today',
  })
  async getLatestDailyDigest(@Param('userId') userId: string): Promise<DigestContentDto> {
    const digest = await this.dailyDigestService.getLatestDigestForUser(userId);
    if (!digest) {
      throw new NotFoundException('No digest found for today');
    }
    return digest.content;
  }
}
