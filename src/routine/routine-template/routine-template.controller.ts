import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { RequestUser } from '@auth/decorators/request-user.decorator';
import type { UserFromJwt } from '@auth/interfaces/jwt-payload.interface';
import { RoutineTemplateService } from './routine-template.service';
import { CreateRoutineTemplateDto } from './dto/create-routine-template.dto';
import { UpdateRoutineTemplateDto } from './dto/update-routine-template.dto';

@ApiTags('routine-templates')
@ApiBearerAuth()
@Controller('routine-templates')
@UseGuards(JwtAuthGuard)
export class RoutineTemplateController {
  constructor(private readonly templateService: RoutineTemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new routine template' })
  async create(
    @RequestUser() user: UserFromJwt,
    @Body() dto: CreateRoutineTemplateDto,
  ) {
    return await this.templateService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all routine templates' })
  async findAll(@RequestUser() user: UserFromJwt) {
    return await this.templateService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a routine template by ID' })
  async findOne(@RequestUser() user: UserFromJwt, @Param('id') id: string) {
    return await this.templateService.findOne(user.id, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a routine template' })
  async update(
    @RequestUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() dto: UpdateRoutineTemplateDto,
  ) {
    return await this.templateService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a routine template' })
  async remove(@RequestUser() user: UserFromJwt, @Param('id') id: string) {
    await this.templateService.remove(user.id, id);
    return { message: 'Template deleted successfully' };
  }
}
