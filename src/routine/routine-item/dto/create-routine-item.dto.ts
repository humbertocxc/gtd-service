import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsArray,
  IsEnum,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { DayOfWeek } from '@routine/shared/enums/day-of-week.enum';
import { TimeOfDay } from '@routine/shared/enums/time-of-day.enum';

export class CreateRoutineItemDto {
  @ApiProperty({
    description: 'ID of the parent routine template',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  templateId: string;

  @ApiProperty({
    description: 'Title of the routine item',
    example: 'Cardio Warmup',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  title: string;

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
    description: 'Estimated duration in minutes',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedDuration?: number;
}
