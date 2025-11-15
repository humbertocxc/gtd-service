import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { RequestUser } from '@auth/decorators/request-user.decorator';
import type { UserFromJwt } from '@auth/interfaces/jwt-payload.interface';
import { RoutineItemService } from './routine-item.service';
import { CreateRoutineItemDto } from './dto/create-routine-item.dto';
import { UpdateRoutineItemDto } from './dto/update-routine-item.dto';

@ApiTags('routine-items')
@ApiBearerAuth()
@Controller('routine-items')
@UseGuards(JwtAuthGuard)
export class RoutineItemController {
  constructor(private readonly itemService: RoutineItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new routine item' })
  async create(
    @RequestUser() user: UserFromJwt,
    @Body() dto: CreateRoutineItemDto,
  ) {
    return await this.itemService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all routine items' })
  async findAll(
    @RequestUser() user: UserFromJwt,
    @Query('templateId') templateId?: string,
  ) {
    return await this.itemService.findAll(user.id, templateId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a routine item by ID' })
  async findOne(@RequestUser() user: UserFromJwt, @Param('id') id: string) {
    return await this.itemService.findOne(user.id, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a routine item' })
  async update(
    @RequestUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() dto: UpdateRoutineItemDto,
  ) {
    return await this.itemService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a routine item' })
  async remove(@RequestUser() user: UserFromJwt, @Param('id') id: string) {
    await this.itemService.remove(user.id, id);
    return { message: 'Item deleted successfully' };
  }
}
