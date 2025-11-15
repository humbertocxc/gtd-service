import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { WeeklyPlanStatus } from '@routine/shared/enums/weekly-plan-status.enum';
import { RoutinePlanEntry } from './routine-plan-entry.entity';

@Entity('weekly_routine_plan')
export class WeeklyRoutinePlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  userId: string;

  @Column({ type: 'date', nullable: false })
  weekStartDate: Date;

  @Column({ type: 'date', nullable: false })
  weekEndDate: Date;

  @Column({
    type: 'enum',
    enum: WeeklyPlanStatus,
    default: WeeklyPlanStatus.ACTIVE,
  })
  @Index()
  status: WeeklyPlanStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => RoutinePlanEntry, entry => entry.weeklyPlan, {
    cascade: true,
  })
  entries: RoutinePlanEntry[];
}
