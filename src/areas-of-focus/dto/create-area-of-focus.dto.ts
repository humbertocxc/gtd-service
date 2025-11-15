import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAreaOfFocusDto {
  @ApiProperty({ description: 'The name of the area of focus', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Optional description of the area of focus',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
