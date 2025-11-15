import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { Action } from '../models/action.entity';
import { InboxItem } from '../models/inbox-item.entity';
import { ActivityLog } from '../models/activity-log.entity';
import { Project } from '../models/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Action, InboxItem, ActivityLog, Project]),
  ],
  controllers: [ActionsController],
  providers: [ActionsService],
  exports: [ActionsService],
})
export class ActionsModule {}
