import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  ParseBoolPipe,
  Body,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ActionsService } from './actions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestUser } from '../auth/decorators/request-user.decorator';
import type { UserFromJwt } from '../auth/interfaces/jwt-payload.interface';
import { FilterActionsDto } from './dto/filter-actions.dto';

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

  @Get('filtered')
  @ApiOperation({
    summary: 'Get actions with advanced filtering and pagination',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of actions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAllFiltered(
    @RequestUser() user: UserFromJwt,
    @Query() filters: FilterActionsDto,
  ) {
    return this.actionsService.findAllWithFilters(user.id, filters);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark action as complete' })
  async complete(@RequestUser() user: UserFromJwt, @Param('id') id: string) {
    return this.actionsService.complete(user.id, id);
  }

  @Patch(':id/next')
  @ApiOperation({ summary: 'Move action to next actions list' })
  @ApiResponse({ status: 200, description: 'Action moved to next' })
  @ApiResponse({ status: 404, description: 'Action not found' })
  async moveToNext(@Param('id') id: string, @RequestUser() user: UserFromJwt) {
    return this.actionsService.moveToNextAction(id, user.id);
  }

  @Patch(':id/waiting')
  @ApiOperation({ summary: 'Mark action as waiting for someone' })
  @ApiResponse({ status: 200, description: 'Action marked as waiting' })
  @ApiResponse({ status: 404, description: 'Action not found' })
  async markAsWaiting(
    @Param('id') id: string,
    @Body('waitingFor') waitingFor: string,
    @RequestUser() user: UserFromJwt,
  ) {
    return this.actionsService.markAsWaiting(id, user.id, waitingFor);
  }

  @Patch(':id/someday')
  @ApiOperation({ summary: 'Move action to someday/maybe list' })
  @ApiResponse({ status: 200, description: 'Action moved to someday' })
  @ApiResponse({ status: 404, description: 'Action not found' })
  async moveToSomeday(
    @Param('id') id: string,
    @RequestUser() user: UserFromJwt,
  ) {
    return this.actionsService.moveToSomeday(id, user.id);
  }

  @Post(':id/complete-action')
  @ApiOperation({ summary: 'Complete an action (with recurrence support)' })
  @ApiResponse({ status: 200, description: 'Action completed' })
  @ApiResponse({ status: 404, description: 'Action not found' })
  async completeAction(
    @Param('id') id: string,
    @RequestUser() user: UserFromJwt,
  ) {
    return this.actionsService.completeAction(id, user.id);
  }
}
