import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeeklyRoutinePlan } from '../models/weekly-routine-plan.entity';
import { RoutinePlanEntry } from '../models/routine-plan-entry.entity';
import { RoutinePlanService } from './routine-plan.service';
import { RoutinePlanController } from './routine-plan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WeeklyRoutinePlan, RoutinePlanEntry])],
  controllers: [RoutinePlanController],
  providers: [RoutinePlanService],
  exports: [RoutinePlanService],
})
export class RoutinePlanModule {}
