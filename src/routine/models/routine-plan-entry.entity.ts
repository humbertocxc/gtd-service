import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { WeeklyRoutinePlan } from './weekly-routine-plan.entity';
import { RoutineItem } from '@routine/models/routine-item.entity';
import { DayOfWeek } from '@routine/shared/enums/day-of-week.enum';
import { TimeOfDay } from '@routine/shared/enums/time-of-day.enum';
import { DailyRoutineInstance } from '@routine/models/daily-routine-instance.entity';

@Entity('routine_plan_entry')
export class RoutinePlanEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  weeklyPlanId: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  routineItemId: string;

  @Column({ type: 'simple-array', nullable: false })
  daysOfWeek: DayOfWeek[];

  @Column({
    type: 'enum',
    enum: TimeOfDay,
    default: TimeOfDay.ANYTIME,
  })
  timePreference: TimeOfDay;

  @Column({ type: 'int', nullable: true })
  estimatedDuration: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => WeeklyRoutinePlan, plan => plan.entries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'weeklyPlanId' })
  weeklyPlan: WeeklyRoutinePlan;

  @ManyToOne(() => RoutineItem, item => item.planEntries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'routineItemId' })
  routineItem: RoutineItem;

  @OneToMany(
    () => DailyRoutineInstance,
    (instance: DailyRoutineInstance) => instance.planEntry,
  )
  instances: DailyRoutineInstance[];
}
