import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeeklyRoutinePlan } from '@routine/models/weekly-routine-plan.entity';
import { RoutinePlanEntry } from '@routine/models/routine-plan-entry.entity';
import { DailyRoutineInstance } from '@routine/models/daily-routine-instance.entity';
import { RoutineItem } from '@routine/models/routine-item.entity';
import { RoutineSchedulerService } from './routine-scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WeeklyRoutinePlan,
      RoutinePlanEntry,
      DailyRoutineInstance,
      RoutineItem,
    ]),
  ],
  providers: [RoutineSchedulerService],
  exports: [RoutineSchedulerService],
})
export class RoutineSchedulerModule {}
