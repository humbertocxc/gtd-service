import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { RoutineTemplate } from '@routine/models/routine-template.entity';
import { RoutinePlanEntry } from '@routine/models/routine-plan-entry.entity';
import { DayOfWeek } from '@routine/shared/enums/day-of-week.enum';
import { TimeOfDay } from '@routine/shared/enums/time-of-day.enum';

@Entity('routine_item')
export class RoutineItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  templateId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'simple-array', nullable: false })
  daysOfWeek: DayOfWeek[];

  @Column({
    type: 'enum',
    enum: TimeOfDay,
    default: TimeOfDay.ANYTIME,
  })
  timePreference: TimeOfDay;

  @Column({ type: 'int', nullable: true })
  estimatedDuration: number | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => RoutineTemplate, template => template.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'templateId' })
  template: RoutineTemplate;

  @OneToMany(() => RoutinePlanEntry, entry => entry.routineItem)
  planEntries: RoutinePlanEntry[];
}
