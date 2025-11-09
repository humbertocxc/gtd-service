import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InboxService } from './inbox.service';
import { CreateInboxItemDto } from './dto/create-inbox-item.dto';
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
}
