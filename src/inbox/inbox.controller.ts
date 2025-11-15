import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { InboxService } from './inbox.service';
import { CreateInboxItemDto } from './dto/create-inbox-item.dto';
import { ConvertInboxItemDto } from './dto/convert-inbox-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequestUser } from '../auth/decorators/request-user.decorator';
import type { UserFromJwt } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('inbox')
@ApiBearerAuth()
@Controller('inbox')
@UseGuards(JwtAuthGuard)
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Post()
  @ApiOperation({ summary: 'Capture a new inbox item' })
  async create(
    @RequestUser() user: UserFromJwt,
    @Body() createInboxItemDto: CreateInboxItemDto,
  ) {
    return this.inboxService.create(user.id, createInboxItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all inbox items' })
  async findAll(@RequestUser() user: UserFromJwt) {
    return this.inboxService.findAll(user.id);
  }

  @Post(':id/convert-to-action')
  @ApiOperation({ summary: 'Convert inbox item to action' })
  async convertToAction(
    @RequestUser() user: UserFromJwt,
    @Param('id') id: string,
  ) {
    return this.inboxService.convertToAction(user.id, id);
  }

  @Post(':id/convert')
  @ApiOperation({
    summary:
      'Convert inbox item to action or project (with transactional support)',
  })
  @ApiResponse({
    status: 201,
    description: 'Inbox item converted successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Inbox item not found' })
  async convert(
    @Param('id') id: string,
    @Body() convertDto: ConvertInboxItemDto,
    @RequestUser() user: UserFromJwt,
  ) {
    return this.inboxService.convertInboxItem(id, user.id, convertDto);
  }
}
