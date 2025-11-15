import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Action } from '../models/action.entity';
import { InboxItem } from '../models/inbox-item.entity';
import { ActivityLog } from '../models/activity-log.entity';
import { Project } from '../models/project.entity';
import { ActionStatus } from '../models/action-status.enum';
import { FilterActionsDto } from './dto/filter-actions.dto';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,
    @InjectRepository(InboxItem)
    private inboxRepository: Repository<InboxItem>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private dataSource: DataSource,
  ) {}

  async findAll(userId: string, next?: boolean): Promise<Action[]> {
    const queryBuilder = this.actionRepository
      .createQueryBuilder('action')
      .where('action.userId = :userId', { userId })
      .andWhere('action.completed = :completed', { completed: false })
      .orderBy('action.createdAt', 'ASC');

    if (next) {
      queryBuilder.limit(1);
    }

    return queryBuilder.getMany();
  }

  async findAllWithFilters(
    userId: string,
    filters: FilterActionsDto,
  ): Promise<{
    data: Action[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
  }> {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const qb = this.actionRepository
      .createQueryBuilder('action')
      .leftJoinAndSelect('action.context', 'context')
      .leftJoinAndSelect('action.project', 'project')
      .leftJoin('project.areaOfFocus', 'areaOfFocus')
      .where('action.userId = :userId', { userId });

    if (filters.status) {
      qb.andWhere('action.status = :status', { status: filters.status });
    }

    if (filters.contextId) {
      qb.andWhere('action.contextId = :contextId', {
        contextId: filters.contextId,
      });
    }

    if (filters.projectId) {
      qb.andWhere('action.projectId = :projectId', {
        projectId: filters.projectId,
      });
    }

    if (filters.areaOfFocusId) {
      qb.andWhere('areaOfFocus.id = :areaOfFocusId', {
        areaOfFocusId: filters.areaOfFocusId,
      });
    }

    if (filters.dueBefore) {
      qb.andWhere('action.dueDate < :dueBefore', {
        dueBefore: new Date(filters.dueBefore),
      });
    }

    if (filters.dueAfter) {
      qb.andWhere('action.dueDate > :dueAfter', {
        dueAfter: new Date(filters.dueAfter),
      });
    }

    const [data, total] = await qb
      .orderBy('action.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async complete(userId: string, id: string): Promise<Action> {
    const action = await this.actionRepository.findOne({
      where: { id, userId },
    });

    if (!action) {
      throw new NotFoundException(`Action with id ${id} not found`);
    }

    action.completed = true;
    action.completedAt = new Date();

    return this.actionRepository.save(action);
  }

  async clarifyInboxItem(
    inboxId: string,
    userId: string,
    actionData: {
      description: string;
      contextId?: string;
      waitingForPerson?: string;
    },
  ): Promise<Action> {
    const inbox = await this.inboxRepository.findOne({
      where: { id: inboxId, userId },
    });

    if (!inbox) {
      throw new NotFoundException(`Inbox item with id ${inboxId} not found`);
    }

    const action = this.actionRepository.create({
      ...actionData,
      userId,
      status: ActionStatus.CLARIFIED,
    });

    const savedAction = await this.actionRepository.save(action);

    await this.logActivity({
      entityType: 'InboxItem',
      entityId: inboxId,
      userId,
      action: 'clarified',
      payload: {
        actionId: savedAction.id,
        description: actionData.description,
      },
    });

    return savedAction;
  }

  async moveToNextAction(actionId: string, userId: string): Promise<Action> {
    const action = await this.verifyOwnership(actionId, userId);

    action.status = ActionStatus.NEXT;
    const updated = await this.actionRepository.save(action);

    await this.logActivity({
      entityType: 'Action',
      entityId: actionId,
      userId,
      action: 'moved_to_next',
      payload: { previousStatus: action.status },
    });

    return updated;
  }

  async markAsWaiting(
    actionId: string,
    userId: string,
    waitingFor: string,
  ): Promise<Action> {
    const action = await this.verifyOwnership(actionId, userId);

    action.status = ActionStatus.WAITING;
    action.waitingForPerson = waitingFor;
    const updated = await this.actionRepository.save(action);

    await this.logActivity({
      entityType: 'Action',
      entityId: actionId,
      userId,
      action: 'marked_as_waiting',
      payload: { waitingFor },
    });

    return updated;
  }

  async moveToSomeday(actionId: string, userId: string): Promise<Action> {
    const action = await this.verifyOwnership(actionId, userId);

    action.status = ActionStatus.SOMEDAY;
    const updated = await this.actionRepository.save(action);

    await this.logActivity({
      entityType: 'Action',
      entityId: actionId,
      userId,
      action: 'moved_to_someday',
      payload: { previousStatus: action.status },
    });

    return updated;
  }

  async completeAction(actionId: string, userId: string): Promise<Action> {
    const action = await this.verifyOwnership(actionId, userId);

    action.status = ActionStatus.DONE;
    action.completed = true;
    action.completedAt = new Date();
    const updated = await this.actionRepository.save(action);

    await this.logActivity({
      entityType: 'Action',
      entityId: actionId,
      userId,
      action: 'completed',
      payload: { completedAt: action.completedAt },
    });

    return updated;
  }

  private async verifyOwnership(
    actionId: string,
    userId: string,
  ): Promise<Action> {
    const action = await this.actionRepository.findOne({
      where: { id: actionId },
    });

    if (!action) {
      throw new NotFoundException(`Action with id ${actionId} not found`);
    }

    if (action.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this action',
      );
    }

    return action;
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
