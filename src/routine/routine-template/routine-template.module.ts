import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineTemplate } from '../models/routine-template.entity';
import { RoutineTemplateService } from './routine-template.service';
import { RoutineTemplateController } from './routine-template.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoutineTemplate])],
  controllers: [RoutineTemplateController],
  providers: [RoutineTemplateService],
  exports: [RoutineTemplateService],
})
export class RoutineTemplateModule {}
