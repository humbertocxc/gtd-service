import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyRoutinePlan } from '../models/weekly-routine-plan.entity';
import { RoutinePlanEntry } from '../models/routine-plan-entry.entity';
import { CreateWeeklyPlanDto } from './dto/create-weekly-plan.dto';
import { UpdateWeeklyPlanDto } from './dto/update-weekly-plan.dto';

@Injectable()
export class RoutinePlanService {
  constructor(
    @InjectRepository(WeeklyRoutinePlan)
    private readonly planRepository: Repository<WeeklyRoutinePlan>,
    @InjectRepository(RoutinePlanEntry)
    private readonly entryRepository: Repository<RoutinePlanEntry>,
  ) {}

  async create(
    userId: string,
    dto: CreateWeeklyPlanDto,
  ): Promise<WeeklyRoutinePlan> {
    const plan = this.planRepository.create({
      userId,
      weekStartDate: new Date(dto.weekStartDate),
      weekEndDate: new Date(dto.weekEndDate),
    });
    const savedPlan = await this.planRepository.save(plan);

    const entries = dto.entries.map(entry =>
      this.entryRepository.create({
        userId,
        weeklyPlanId: savedPlan.id,
        routineItemId: entry.routineItemId,
        daysOfWeek: entry.daysOfWeek,
        timePreference: entry.timePreference,
        estimatedDuration: entry.estimatedDuration,
      }),
    );
    await this.entryRepository.save(entries);

    return await this.findOne(userId, savedPlan.id);
  }

  async findAll(userId: string): Promise<WeeklyRoutinePlan[]> {
    return await this.planRepository.find({
      where: { userId },
      relations: ['entries', 'entries.routineItem'],
      order: { weekStartDate: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<WeeklyRoutinePlan> {
    const plan = await this.planRepository.findOne({
      where: { id, userId },
      relations: ['entries', 'entries.routineItem'],
    });
    if (!plan) {
      throw new NotFoundException(
        `Weekly routine plan with ID ${id} not found`,
      );
    }
    return plan;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateWeeklyPlanDto,
  ): Promise<WeeklyRoutinePlan> {
    const plan = await this.findOne(userId, id);

    if (dto.status) {
      plan.status = dto.status;
    }

    if (dto.entries) {
      await this.entryRepository.delete({ weeklyPlanId: id, userId });

      const entries = dto.entries.map(entry =>
        this.entryRepository.create({
          userId,
          weeklyPlanId: id,
          routineItemId: entry.routineItemId,
          daysOfWeek: entry.daysOfWeek,
          timePreference: entry.timePreference,
          estimatedDuration: entry.estimatedDuration,
        }),
      );
      await this.entryRepository.save(entries);
    }

    await this.planRepository.save(plan);
    return await this.findOne(userId, id);
  }

  async remove(userId: string, id: string): Promise<void> {
    const plan = await this.findOne(userId, id);
    await this.planRepository.remove(plan);
  }
}
