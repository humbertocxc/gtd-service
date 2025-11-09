import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ActionsService } from './actions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestUser } from '../auth/decorators/request-user.decorator';
import type { UserFromJwt } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('actions')
@ApiBearerAuth()
@Controller('actions')
@UseGuards(JwtAuthGuard)
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get()
  @ApiOperation({ summary: 'List actions, optionally get next action' })
  @ApiQuery({ name: 'next', required: false, type: Boolean })
  async findAll(
    @RequestUser() user: UserFromJwt,
    @Query('next', new ParseBoolPipe({ optional: true })) next?: boolean,
  ) {
    return this.actionsService.findAll(user.id, next);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark action as complete' })
  async complete(@RequestUser() user: UserFromJwt, @Param('id') id: string) {
    return this.actionsService.complete(user.id, id);
  }
}
