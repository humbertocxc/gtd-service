import { Controller, Get } from '@nestjs/common';
import { RequestUser } from './auth/decorators/request-user.decorator.js';
import { Roles } from './auth/decorators/roles.decorator.js';
import type { RequestUser as IRequestUser } from './auth/interfaces/auth.interface.js';

@Controller('example')
export class ExampleController {
  @Get('profile')
  getProfile(@RequestUser() user: IRequestUser) {
    return {
      message: 'User profile',
      userId: user.userId,
      roles: user.roles,
    };
  }

  @Get('admin')
  @Roles('admin')
  getAdminData(@RequestUser('userId') userId: string) {
    return {
      message: 'Admin data',
      userId,
    };
  }

  @Get('management')
  @Roles('admin', 'manager')
  getManagementData(@RequestUser() user: IRequestUser) {
    return {
      message: 'Management data',
      user,
    };
  }
}
