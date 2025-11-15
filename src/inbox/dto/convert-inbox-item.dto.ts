import { IsString, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum ConversionType {
  ACTION = 'action',
  PROJECT = 'project',
}

export class ActionPayloadDto {
  @ApiProperty({ description: 'Action description' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ description: 'Context ID' })
  @IsOptional()
  @IsString()
  contextId?: string;

  @ApiPropertyOptional({ description: 'Project ID' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Due date (ISO 8601)' })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiPropertyOptional({ description: 'Waiting for person' })
  @IsOptional()
  @IsString()
  waitingForPerson?: string;
}

export class ProjectPayloadDto {
  @ApiProperty({ description: 'Project name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Area of focus ID' })
  @IsOptional()
  @IsString()
  areaOfFocusId?: string;
}

export class ConvertInboxItemDto {
  @ApiProperty({ enum: ConversionType, description: 'Type of conversion' })
  @IsEnum(ConversionType)
  type: ConversionType;

  @ApiPropertyOptional({ type: ActionPayloadDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ActionPayloadDto)
  actionPayload?: ActionPayloadDto;

  @ApiPropertyOptional({ type: ProjectPayloadDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectPayloadDto)
  projectPayload?: ProjectPayloadDto;
}
