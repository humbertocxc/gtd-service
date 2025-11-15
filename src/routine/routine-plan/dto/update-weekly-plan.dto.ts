import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { WeeklyPlanStatus } from '@routine/shared/enums/weekly-plan-status.enum';
import { RoutinePlanEntryInputDto } from './create-weekly-plan.dto';

export class UpdateWeeklyPlanDto {
  @ApiProperty({
    description: 'Updated list of routine items',
    type: [RoutinePlanEntryInputDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutinePlanEntryInputDto)
  entries?: RoutinePlanEntryInputDto[];

  @ApiProperty({
    description: 'Plan status',
    example: WeeklyPlanStatus.ARCHIVED,
    enum: WeeklyPlanStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(WeeklyPlanStatus)
  status?: WeeklyPlanStatus;
}
