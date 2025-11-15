import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { WeeklyRoutinePlan } from '@routine/models/weekly-routine-plan.entity';
import { RoutinePlanEntry } from '@routine/models/routine-plan-entry.entity';
import { DailyRoutineInstance } from '@routine/models/daily-routine-instance.entity';
import { RoutineItem } from '@routine/models/routine-item.entity';
import { WeeklyPlanStatus } from '@routine/shared/enums/weekly-plan-status.enum';
import { DayOfWeek } from '@routine/shared/enums/day-of-week.enum';

@Injectable()
export class RoutineSchedulerService {
  private readonly logger = new Logger(RoutineSchedulerService.name);

  constructor(
    @InjectRepository(WeeklyRoutinePlan)
    private readonly planRepository: Repository<WeeklyRoutinePlan>,
    @InjectRepository(RoutinePlanEntry)
    private readonly entryRepository: Repository<RoutinePlanEntry>,
    @InjectRepository(DailyRoutineInstance)
    private readonly instanceRepository: Repository<DailyRoutineInstance>,
    @InjectRepository(RoutineItem)
    private readonly itemRepository: Repository<RoutineItem>,
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  async generateWeeklyPlans() {
    this.logger.log('Starting weekly plan generation...');

    try {
      const items = await this.itemRepository.find({
        where: { isActive: true },
        relations: ['template'],
      });

      const userItems = this.groupByUser(items);

      for (const [userId, userItemList] of Object.entries(userItems)) {
        await this.createWeeklyPlanForUser(userId, userItemList);
      }

      this.logger.log('Weekly plan generation completed');
    } catch (error) {
      this.logger.error('Error generating weekly plans', error);
    }
  }

  @Cron('0 1 * * *')
  async generateDailyInstances() {
    this.logger.log('Starting daily instance generation...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dayOfWeek = this.getDayOfWeek(today);

      const plans = await this.planRepository.find({
        where: {
          status: WeeklyPlanStatus.ACTIVE,
          weekStartDate: LessThan(new Date(today.getTime() + 86400000)),
        },
        relations: ['entries', 'entries.routineItem'],
      });

      for (const plan of plans) {
        const todayEntries = plan.entries.filter(entry =>
          entry.daysOfWeek.includes(dayOfWeek),
        );

        for (const entry of todayEntries) {
          const existing = await this.instanceRepository.findOne({
            where: {
              planEntryId: entry.id,
              scheduledDate: today,
              userId: entry.userId,
            },
          });

          if (!existing) {
            const newInstance = new DailyRoutineInstance();
            newInstance.userId = entry.userId;
            newInstance.planEntryId = entry.id;
            newInstance.scheduledDate = today;
            newInstance.title = entry.routineItem.title;
            newInstance.description = entry.routineItem.description || '';
            newInstance.estimatedDuration = Number(
              entry.estimatedDuration ||
                entry.routineItem.estimatedDuration ||
                0,
            );
            await this.instanceRepository.save(newInstance);
          }
        }
      }

      this.logger.log('Daily instance generation completed');
    } catch (error) {
      this.logger.error('Error generating daily instances', error);
    }
  }

  @Cron('0 2 * * *')
  async handleCarryover() {
    this.logger.log('Starting carryover processing...');

    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const incompleteInstances = await this.instanceRepository.find({
        where: {
          scheduledDate: yesterday,
          completed: false,
          skipped: false,
          carriedOver: false,
        },
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const instance of incompleteInstances) {
        const carriedInstance = new DailyRoutineInstance();
        carriedInstance.userId = instance.userId;
        carriedInstance.planEntryId = instance.planEntryId;
        carriedInstance.scheduledDate = today;
        carriedInstance.title = `[Carryover] ${instance.title}`;
        carriedInstance.description = instance.description;
        carriedInstance.estimatedDuration = instance.estimatedDuration;
        await this.instanceRepository.save(carriedInstance);

        instance.carriedOver = true;
        instance.carriedOverToDate = today;
        await this.instanceRepository.save(instance);
      }

      this.logger.log(
        `Carryover processing completed: ${incompleteInstances.length} instances`,
      );
    } catch (error) {
      this.logger.error('Error handling carryover', error);
    }
  }

  private groupByUser(items: RoutineItem[]): Record<string, RoutineItem[]> {
    return items.reduce(
      (acc, item) => {
        if (!acc[item.userId]) {
          acc[item.userId] = [];
        }
        acc[item.userId].push(item);
        return acc;
      },
      {} as Record<string, RoutineItem[]>,
    );
  }

  private async createWeeklyPlanForUser(
    userId: string,
    items: RoutineItem[],
  ): Promise<void> {
    const weekStart = this.getNextSunday();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const existing = await this.planRepository.findOne({
      where: { userId, weekStartDate: weekStart },
    });

    if (existing) {
      return;
    }

    const plan = this.planRepository.create({
      userId,
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      status: WeeklyPlanStatus.ACTIVE,
    });
    const savedPlan = await this.planRepository.save(plan);

    const entries = items.map(item =>
      this.entryRepository.create({
        userId,
        weeklyPlanId: savedPlan.id,
        routineItemId: item.id,
        daysOfWeek: item.daysOfWeek,
        timePreference: item.timePreference,
        estimatedDuration: item.estimatedDuration ?? undefined,
      }),
    );
    await this.entryRepository.save(entries);
  }

  private getNextSunday(): Date {
    const date = new Date();
    date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private getDayOfWeek(date: Date): DayOfWeek {
    const days = [
      DayOfWeek.SUN,
      DayOfWeek.MON,
      DayOfWeek.TUE,
      DayOfWeek.WED,
      DayOfWeek.THU,
      DayOfWeek.FRI,
      DayOfWeek.SAT,
    ];
    return days[date.getDay()];
  }
}
