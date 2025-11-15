import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InboxController } from './inbox.controller';
import { InboxService } from './inbox.service';
import { InboxItem } from '../entities/inbox-item.entity';
import { Action } from '../entities/action.entity';
import { Project } from '../entities/project.entity';
import { ActivityLog } from '../entities/activity-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InboxItem, Action, Project, ActivityLog]),
  ],
  controllers: [InboxController],
  providers: [InboxService],
})
export class InboxModule {}
