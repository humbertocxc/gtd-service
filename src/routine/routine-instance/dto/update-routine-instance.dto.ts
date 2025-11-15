import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateRoutineInstanceDto {
  @ApiProperty({
    description: 'Mark the instance as completed',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({
    description: 'Mark the instance as skipped',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  skipped?: boolean;

  @ApiProperty({
    description: 'Reason for skipping',
    example: 'Weather was bad',
    required: false,
  })
  @IsOptional()
  @IsString()
  skipReason?: string;
}
