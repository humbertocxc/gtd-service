import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasOfFocusController } from './areas-of-focus.controller';
import { AreasOfFocusService } from './areas-of-focus.service';
import { AreaOfFocus } from '../models/area-of-focus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AreaOfFocus])],
  controllers: [AreasOfFocusController],
  providers: [AreasOfFocusService],
  exports: [AreasOfFocusService],
})
export class AreasOfFocusModule {}
