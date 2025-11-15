import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class FilterInstancesDto {
  @ApiProperty({
    description: 'Filter by scheduled date (ISO 8601)',
    example: '2025-01-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @ApiProperty({
    description: 'Filter by start date range (ISO 8601)',
    example: '2025-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Filter by end date range (ISO 8601)',
    example: '2025-01-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
