import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ operationId: 'createUser' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('digest/:hour')
  @ApiOperation({ operationId: 'findUsersByDigestHour' })
  findByDigestHour(@Param('hour') hour: string) {
    return this.usersService.findByDigestHour(hour);
  }

  @Get(':id')
  @ApiOperation({ operationId: 'findUserById' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/preferences')
  @ApiOperation({ operationId: 'updateUserPreferences' })
  updatePreferences(@Param('id') id: string, @Body('preferences') preferences: any[]) {
    return this.usersService.updatePreferences(id, preferences);
  }

  @Patch(':id/digest-time')
  @ApiOperation({ operationId: 'updateUserDigestTime' })
  updateDigestTime(@Param('id') id: string, @Body('digestTime') digestTime: string) {
    return this.usersService.updateDigestTime(id, digestTime);
  }

  @Delete(':id')
  @ApiOperation({ operationId: 'removeUser' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
