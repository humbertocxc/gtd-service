import { Module } from '@nestjs/common';
import { RoutineTemplateModule } from '@routine/routine-template/routine-template.module';
import { RoutineItemModule } from '@routine/routine-item/routine-item.module';
import { RoutinePlanModule } from '@routine/routine-plan/routine-plan.module';
import { RoutineInstanceModule } from '@routine/routine-instance/routine-instance.module';
import { RoutineSchedulerModule } from '@routine/routine-scheduler/routine-scheduler.module';

@Module({
  imports: [
    RoutineTemplateModule,
    RoutineItemModule,
    RoutinePlanModule,
    RoutineInstanceModule,
    RoutineSchedulerModule,
  ],
  exports: [
    RoutineTemplateModule,
    RoutineItemModule,
    RoutinePlanModule,
    RoutineInstanceModule,
    RoutineSchedulerModule,
  ],
})
export class RoutineModule {}
