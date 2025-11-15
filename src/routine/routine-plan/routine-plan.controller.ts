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
import { RoutinePlanService } from './routine-plan.service';
import { CreateWeeklyPlanDto } from './dto/create-weekly-plan.dto';
import { UpdateWeeklyPlanDto } from './dto/update-weekly-plan.dto';

@ApiTags('routine-plans')
@ApiBearerAuth()
@Controller('routine-plans')
@UseGuards(JwtAuthGuard)
export class RoutinePlanController {
  constructor(private readonly planService: RoutinePlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new weekly routine plan' })
  async create(
    @RequestUser() user: UserFromJwt,
    @Body() dto: CreateWeeklyPlanDto,
  ) {
    return await this.planService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all weekly routine plans' })
  async findAll(@RequestUser() user: UserFromJwt) {
    return await this.planService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a weekly routine plan by ID' })
  async findOne(@RequestUser() user: UserFromJwt, @Param('id') id: string) {
    return await this.planService.findOne(user.id, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a weekly routine plan' })
  async update(
    @RequestUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() dto: UpdateWeeklyPlanDto,
  ) {
    return await this.planService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a weekly routine plan' })
  async remove(@RequestUser() user: UserFromJwt, @Param('id') id: string) {
    await this.planService.remove(user.id, id);
    return { message: 'Plan deleted successfully' };
  }
}
