import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContextDto {
  @ApiProperty({ description: 'The name of the context', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Optional description of the context' })
  @IsOptional()
  @IsString()
  description?: string;
}
