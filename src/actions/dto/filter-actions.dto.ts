import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ActionStatus } from '../../entities/action-status.enum';

export class FilterActionsDto {
  @ApiPropertyOptional({ enum: ActionStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(ActionStatus)
  status?: ActionStatus;

  @ApiPropertyOptional({ description: 'Filter by context ID' })
  @IsOptional()
  @IsString()
  contextId?: string;

  @ApiPropertyOptional({ description: 'Filter by project ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Filter by area of focus ID' })
  @IsOptional()
  @IsString()
  areaOfFocusId?: string;

  @ApiPropertyOptional({
    description: 'Filter actions due before this date (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  dueBefore?: string;

  @ApiPropertyOptional({
    description: 'Filter actions due after this date (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  dueAfter?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Page size', default: 20 })
  @IsOptional()
  pageSize?: number;
}
