import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineGTDConversionEvent } from '../models/routine-gtd-conversion-event.entity';
import { DailyRoutineInstance } from '@routine/models/daily-routine-instance.entity';
import { Action } from '@models/action.entity';
import { RoutineConversionService } from './routine-conversion.service';
import { RoutineConversionController } from './routine-conversion.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoutineGTDConversionEvent,
      DailyRoutineInstance,
      Action,
    ]),
  ],
  controllers: [RoutineConversionController],
  providers: [RoutineConversionService],
  exports: [RoutineConversionService],
})
export class RoutineConversionModule {}
