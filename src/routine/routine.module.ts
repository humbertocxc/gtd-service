import { Module } from '@nestjs/common';
import { RoutineTemplateModule } from '@routine/routine-template/routine-template.module';

@Module({
  imports: [RoutineTemplateModule],
  exports: [RoutineTemplateModule],
})
export class RoutineModule {}
