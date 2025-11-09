import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from '../entities/action.entity';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,
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
}
