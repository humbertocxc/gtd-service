import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineItem } from '../models/routine-item.entity';
import { RoutineItemService } from './routine-item.service';
import { RoutineItemController } from './routine-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoutineItem])],
  controllers: [RoutineItemController],
  providers: [RoutineItemService],
  exports: [RoutineItemService],
})
export class RoutineItemModule {}
