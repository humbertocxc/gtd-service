import { Module } from '@nestjs/common';
import { RoutineTemplateModule } from '@routine/routine-template/routine-template.module';
import { RoutineItemModule } from '@routine/routine-item/routine-item.module';

@Module({
  imports: [RoutineTemplateModule, RoutineItemModule],
  exports: [RoutineTemplateModule, RoutineItemModule],
})
export class RoutineModule {}
