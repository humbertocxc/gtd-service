import { PartialType } from '@nestjs/swagger';
import { CreateAreaOfFocusDto } from './create-area-of-focus.dto';

export class UpdateAreaOfFocusDto extends PartialType(CreateAreaOfFocusDto) {}
