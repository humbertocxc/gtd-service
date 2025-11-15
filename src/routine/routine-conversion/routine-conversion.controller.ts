import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { RequestUser } from '@auth/decorators/request-user.decorator';
import type { UserFromJwt } from '@auth/interfaces/jwt-payload.interface';
import { RoutineConversionService } from './routine-conversion.service';
import { ConvertToActionDto } from './dto/convert-to-action.dto';

@ApiTags('routine-conversion')
@ApiBearerAuth()
@Controller('routine-conversion')
@UseGuards(JwtAuthGuard)
export class RoutineConversionController {
  constructor(private readonly conversionService: RoutineConversionService) {}

  @Post('convert')
  @ApiOperation({ summary: 'Convert a daily routine instance to GTD action' })
  async convertToAction(
    @RequestUser() user: UserFromJwt,
    @Body() dto: ConvertToActionDto,
  ) {
    return await this.conversionService.convertToAction(user.id, dto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get conversion history' })
  async getHistory(@RequestUser() user: UserFromJwt) {
    return await this.conversionService.findConversionHistory(user.id);
  }
}
