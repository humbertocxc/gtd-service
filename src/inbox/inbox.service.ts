import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InboxItem } from '../entities/inbox-item.entity';
import { Action } from '../entities/action.entity';
import { Project } from '../entities/project.entity';
import { ActivityLog } from '../entities/activity-log.entity';
import { CreateInboxItemDto } from './dto/create-inbox-item.dto';
import {
  ConvertInboxItemDto,
  ConversionType,
} from './dto/convert-inbox-item.dto';
import { ActionStatus } from '../entities/action-status.enum';

@Injectable()
export class InboxService {
  constructor(
    @InjectRepository(InboxItem)
    private inboxRepository: Repository<InboxItem>,
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
    private dataSource: DataSource,
  ) {}

  async create(
    userId: string,
    createInboxItemDto: CreateInboxItemDto,
  ): Promise<InboxItem> {
    const inboxItem = this.inboxRepository.create({
      userId,
      content: createInboxItemDto.content,
    });

    const saved = await this.inboxRepository.save(inboxItem);

    await this.logActivity({
      entityType: 'InboxItem',
      entityId: saved.id,
      userId,
      action: 'captured',
      payload: { content: createInboxItemDto.content },
    });

    return saved;
  }

  async findAll(userId: string): Promise<InboxItem[]> {
    return this.inboxRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async convertToAction(userId: string, id: string): Promise<Action> {
    const inboxItem = await this.inboxRepository.findOne({
      where: { id, userId },
    });

    if (!inboxItem) {
      throw new NotFoundException(`Inbox item with id ${id} not found`);
    }

    const action = this.actionRepository.create({
      userId,
      description: inboxItem.content,
      completed: false,
    });

    const savedAction = await this.actionRepository.save(action);

    await this.inboxRepository.remove(inboxItem);

    return savedAction;
  }

  async convertInboxItem(
    inboxId: string,
    userId: string,
    dto: ConvertInboxItemDto,
  ): Promise<Action | Project> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const inboxItem = await queryRunner.manager.findOne(InboxItem, {
        where: { id: inboxId, userId },
      });

      if (!inboxItem) {
        throw new NotFoundException(`Inbox item with ID ${inboxId} not found`);
      }

      let result: Action | Project;

      if (dto.type === ConversionType.ACTION) {
        if (!dto.actionPayload) {
          throw new BadRequestException(
            'actionPayload is required for action conversion',
          );
        }

        const action = queryRunner.manager.create(Action, {
          ...dto.actionPayload,
          userId,
          status: ActionStatus.CLARIFIED,
          dueDate: dto.actionPayload.dueDate
            ? new Date(dto.actionPayload.dueDate)
            : undefined,
        });

        result = await queryRunner.manager.save(Action, action);

        await queryRunner.manager.save(ActivityLog, {
          entityType: 'InboxItem',
          entityId: inboxId,
          userId,
          action: 'converted_to_action',
          payload: { actionId: result.id },
        });
      } else if (dto.type === ConversionType.PROJECT) {
        if (!dto.projectPayload) {
          throw new BadRequestException(
            'projectPayload is required for project conversion',
          );
        }

        const project = queryRunner.manager.create(Project, {
          ...dto.projectPayload,
          userId,
        });

        result = await queryRunner.manager.save(Project, project);

        await queryRunner.manager.save(ActivityLog, {
          entityType: 'InboxItem',
          entityId: inboxId,
          userId,
          action: 'converted_to_project',
          payload: { projectId: result.id },
        });
      } else {
        throw new BadRequestException('Invalid conversion type');
      }

      await queryRunner.manager.remove(InboxItem, inboxItem);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async logActivity(data: {
    entityType: string;
    entityId: string;
    userId: string;
    action: string;
    payload: Record<string, any>;
  }): Promise<void> {
    const log = this.activityLogRepository.create(data);
    await this.activityLogRepository.save(log);
  }
}
