import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InboxItem } from '../entities/inbox-item.entity';
import { Action } from '../entities/action.entity';
import { CreateInboxItemDto } from './dto/create-inbox-item.dto';

@Injectable()
export class InboxService {
  constructor(
    @InjectRepository(InboxItem)
    private inboxRepository: Repository<InboxItem>,
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,
  ) {}

  async create(
    userId: string,
    createInboxItemDto: CreateInboxItemDto,
  ): Promise<InboxItem> {
    const inboxItem = this.inboxRepository.create({
      userId,
      content: createInboxItemDto.content,
    });
    return this.inboxRepository.save(inboxItem);
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

    // Create action from inbox item
    const action = this.actionRepository.create({
      userId,
      description: inboxItem.content,
      completed: false,
    });

    const savedAction = await this.actionRepository.save(action);

    // Remove the inbox item
    await this.inboxRepository.remove(inboxItem);

    return savedAction;
  }
}
