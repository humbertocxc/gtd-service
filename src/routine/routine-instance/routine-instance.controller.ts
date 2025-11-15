import {
  Controller,
  Get,
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
import { RoutineInstanceService } from './routine-instance.service';
import { UpdateRoutineInstanceDto } from './dto/update-routine-instance.dto';
import { FilterInstancesDto } from './dto/filter-instances.dto';

@ApiTags('routine-instances')
@ApiBearerAuth()
@Controller('routine-instances')
@UseGuards(JwtAuthGuard)
export class RoutineInstanceController {
  constructor(private readonly instanceService: RoutineInstanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all daily routine instances' })
  async findAll(
    @RequestUser() user: UserFromJwt,
    @Query() filter: FilterInstancesDto,
  ) {
    return await this.instanceService.findAll(user.id, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a daily routine instance by ID' })
  async findOne(@RequestUser() user: UserFromJwt, @Param('id') id: string) {
    return await this.instanceService.findOne(user.id, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a daily routine instance' })
  async update(
    @RequestUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() dto: UpdateRoutineInstanceDto,
  ) {
    return await this.instanceService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a daily routine instance' })
  async remove(@RequestUser() user: UserFromJwt, @Param('id') id: string) {
    await this.instanceService.remove(user.id, id);
    return { message: 'Instance deleted successfully' };
  }
}
