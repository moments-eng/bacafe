import { Controller, Get, HttpStatus, NotFoundException, Param, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DigestService } from './digest.service';
import { Digest } from './schemas/digest.schema';
import { QueryDigestDto } from './dto/query-digest.dto';

@ApiTags('Digests')
@Controller('digests')
export class DigestController {
  constructor(private readonly digestService: DigestService) {}

  @Get(':id')
  @ApiOperation({
    operationId: 'getDigestById',
    summary: 'Get digest by ID',
    description: 'Retrieves a specific digest by its ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Digest retrieved successfully',
    type: Digest,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Digest not found',
  })
  async getDigestById(@Param('id') id: string): Promise<Digest> {
    const digest = await this.digestService.findOne(id);
    if (!digest) {
      throw new NotFoundException('Digest not found');
    }
    return digest;
  }

  @Post('trigger')
  @ApiOperation({
    operationId: 'triggerDigestCreation',
    summary: 'Trigger digest creation',
    description: 'Triggers the creation of new digests',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Digest creation has been triggered',
  })
  async triggerDigestCreation(): Promise<void> {
    await this.digestService.triggerCreation();
  }

  @Post('notify/:userId')
  @ApiOperation({
    operationId: 'sendUserNotification',
    summary: 'Send user notification',
    description: 'Sends digest notifications for a specific user',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Notification has been sent',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found or no digests available',
  })
  async sendUserNotification(@Param('userId') userId: string): Promise<void> {
    await this.digestService.sendUserNotification(userId);
  }

  @Post('query')
  @ApiOperation({
    operationId: 'queryDigests',
    summary: 'Query digests',
    description: 'Queries digests based on provided criteria, such as multiple IDs and pagination options.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Digests queried successfully',
    schema: {
      type: 'object',
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/Digest' } },
        total: { type: 'number' },
      },
    },
  })
  async queryDigests(@Body() queryDto: QueryDigestDto): Promise<{ items: Digest[]; total: number }> {
    return await this.digestService.queryDigests(queryDto);
  }
}
