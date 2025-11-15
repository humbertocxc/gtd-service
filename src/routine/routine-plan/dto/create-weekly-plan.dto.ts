import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsArray,
  ValidateNested,
  IsUUID,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DayOfWeek } from '@routine/shared/enums/day-of-week.enum';
import { TimeOfDay } from '@routine/shared/enums/time-of-day.enum';

export class RoutinePlanEntryInputDto {
  @ApiProperty({
    description: 'ID of the routine item to include',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  routineItemId: string;

  @ApiProperty({
    description: 'Days of the week to schedule this item',
    example: ['MON', 'WED', 'FRI'],
    enum: DayOfWeek,
    isArray: true,
  })
  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  daysOfWeek: DayOfWeek[];

  @ApiProperty({
    description: 'Preferred time of day',
    example: TimeOfDay.MORNING,
    enum: TimeOfDay,
    required: false,
  })
  @IsOptional()
  @IsEnum(TimeOfDay)
  timePreference?: TimeOfDay;

  @ApiProperty({
    description: 'Estimated duration in minutes (overrides item default)',
    example: 45,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedDuration?: number;
}

export class CreateWeeklyPlanDto {
  @ApiProperty({
    description: 'Start date of the week (ISO 8601)',
    example: '2025-01-06',
  })
  @IsDateString()
  weekStartDate: string;

  @ApiProperty({
    description: 'End date of the week (ISO 8601)',
    example: '2025-01-12',
  })
  @IsDateString()
  weekEndDate: string;

  @ApiProperty({
    description: 'List of routine items to include in the plan',
    type: [RoutinePlanEntryInputDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutinePlanEntryInputDto)
  entries: RoutinePlanEntryInputDto[];
}
