import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsArray,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class UpdateRoutineTemplateDto {
  @ApiProperty({
    description: 'Name of the routine template',
    example: 'Morning Workout',
    maxLength: 255,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({
    description: 'Detailed description of the routine',
    example: '30-minute cardio session followed by stretching',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Estimated duration in minutes',
    example: 45,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedDuration?: number;

  @ApiProperty({
    description: 'Tags for categorization',
    example: ['health', 'fitness', 'morning'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Whether the template is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
