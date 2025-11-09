import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInboxItemDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
