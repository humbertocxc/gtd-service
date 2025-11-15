import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DailyRoutineInstance } from '../models/daily-routine-instance.entity';
import { UpdateRoutineInstanceDto } from './dto/update-routine-instance.dto';
import { FilterInstancesDto } from './dto/filter-instances.dto';

@Injectable()
export class RoutineInstanceService {
  constructor(
    @InjectRepository(DailyRoutineInstance)
    private readonly instanceRepository: Repository<DailyRoutineInstance>,
  ) {}

  async findAll(
    userId: string,
    filter?: FilterInstancesDto,
  ): Promise<DailyRoutineInstance[]> {
    const where: any = { userId };

    if (filter?.scheduledDate) {
      where.scheduledDate = new Date(filter.scheduledDate);
    } else if (filter?.startDate && filter?.endDate) {
      where.scheduledDate = Between(
        new Date(filter.startDate),
        new Date(filter.endDate),
      );
    }

    return await this.instanceRepository.find({
      where,
      relations: ['planEntry', 'planEntry.routineItem'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async findOne(userId: string, id: string): Promise<DailyRoutineInstance> {
    const instance = await this.instanceRepository.findOne({
      where: { id, userId },
      relations: ['planEntry', 'planEntry.routineItem', 'conversionEvent'],
    });
    if (!instance) {
      throw new NotFoundException(
        `Daily routine instance with ID ${id} not found`,
      );
    }
    return instance;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateRoutineInstanceDto,
  ): Promise<DailyRoutineInstance> {
    const instance = await this.findOne(userId, id);

    if (dto.completed !== undefined) {
      instance.completed = dto.completed;
      instance.completedAt = dto.completed ? new Date() : null;
    }

    if (dto.skipped !== undefined) {
      instance.skipped = dto.skipped;
      instance.skipReason = dto.skipReason || null;
    }

    return await this.instanceRepository.save(instance);
  }

  async remove(userId: string, id: string): Promise<void> {
    const instance = await this.findOne(userId, id);
    await this.instanceRepository.remove(instance);
  }
}
