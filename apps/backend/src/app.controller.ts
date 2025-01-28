import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('/health')
  @ApiOperation({ operationId: 'healthCheck' })
  healthCheck() {
    return 'OK';
  }
}
