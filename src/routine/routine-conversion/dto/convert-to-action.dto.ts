import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class ConvertToActionDto {
  @ApiProperty({
    description: 'ID of the daily routine instance to convert',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  instanceId: string;

  @ApiProperty({
    description: 'Optional notes about the conversion',
    example: 'Converted manually due to time constraints',
    required: false,
  })
  @IsOptional()
  @IsString()
  conversionNotes?: string;
}
