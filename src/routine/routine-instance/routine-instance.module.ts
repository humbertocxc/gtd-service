import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyRoutineInstance } from '../models/daily-routine-instance.entity';
import { RoutineInstanceService } from './routine-instance.service';
import { RoutineInstanceController } from './routine-instance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DailyRoutineInstance])],
  controllers: [RoutineInstanceController],
  providers: [RoutineInstanceService],
  exports: [RoutineInstanceService],
})
export class RoutineInstanceModule {}
