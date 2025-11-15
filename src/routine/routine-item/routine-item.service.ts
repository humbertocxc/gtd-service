import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoutineItem } from '../models/routine-item.entity';
import { CreateRoutineItemDto } from './dto/create-routine-item.dto';
import { UpdateRoutineItemDto } from './dto/update-routine-item.dto';

@Injectable()
export class RoutineItemService {
  constructor(
    @InjectRepository(RoutineItem)
    private readonly itemRepository: Repository<RoutineItem>,
  ) {}

  async create(
    userId: string,
    dto: CreateRoutineItemDto,
  ): Promise<RoutineItem> {
    const item = this.itemRepository.create({
      ...dto,
      userId,
    });
    return await this.itemRepository.save(item);
  }

  async findAll(userId: string, templateId?: string): Promise<RoutineItem[]> {
    const where: any = { userId };
    if (templateId) {
      where.templateId = templateId;
    }
    return await this.itemRepository.find({
      where,
      relations: ['template'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<RoutineItem> {
    const item = await this.itemRepository.findOne({
      where: { id, userId },
      relations: ['template'],
    });
    if (!item) {
      throw new NotFoundException(`Routine item with ID ${id} not found`);
    }
    return item;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateRoutineItemDto,
  ): Promise<RoutineItem> {
    const item = await this.findOne(userId, id);
    Object.assign(item, dto);
    return await this.itemRepository.save(item);
  }

  async remove(userId: string, id: string): Promise<void> {
    const item = await this.findOne(userId, id);
    await this.itemRepository.softRemove(item);
  }
}
