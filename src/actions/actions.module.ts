import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { Action } from '../entities/action.entity';
import { InboxItem } from '../entities/inbox-item.entity';
import { ActivityLog } from '../entities/activity-log.entity';
import { Project } from '../entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Action, InboxItem, ActivityLog, Project]),
  ],
  controllers: [ActionsController],
  providers: [ActionsService],
  exports: [ActionsService],
})
export class ActionsModule {}
