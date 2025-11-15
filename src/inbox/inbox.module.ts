import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboxController } from './inbox.controller';
import { InboxService } from './inbox.service';
import { InboxItem } from '../models/inbox-item.entity';
import { Action } from '../models/action.entity';
import { Project } from '../models/project.entity';
import { ActivityLog } from '../models/activity-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InboxItem, Action, Project, ActivityLog]),
  ],
  controllers: [InboxController],
  providers: [InboxService],
})
export class InboxModule {}
