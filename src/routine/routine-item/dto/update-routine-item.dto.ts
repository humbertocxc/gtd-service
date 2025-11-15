import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsArray,
  IsEnum,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { DayOfWeek } from '@routine/shared/enums/day-of-week.enum';
import { TimeOfDay } from '@routine/shared/enums/time-of-day.enum';

export class UpdateRoutineItemDto {
  @ApiProperty({
    description: 'Title of the routine item',
    example: 'Cardio Warmup',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiProperty({
    description: 'Description of the routine item',
    example: '10 minutes of light jogging',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Days of the week to schedule this item',
    example: ['MON', 'WED', 'FRI'],
    enum: DayOfWeek,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  daysOfWeek?: DayOfWeek[];

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
    description: 'Estimated duration in minutes',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedDuration?: number;

  @ApiProperty({
    description: 'Whether the item is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
