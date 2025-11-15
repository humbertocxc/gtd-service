import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RoutinePlanEntry } from '@routine/models/routine-plan-entry.entity';

@Entity('daily_routine_instance')
export class DailyRoutineInstance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  userId: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  planEntryId: string;

  @Column({ type: 'date', nullable: false })
  @Index()
  scheduledDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  estimatedDuration: number;

  @Column({ type: 'boolean', default: false })
  @Index()
  completed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @Column({ type: 'boolean', default: false })
  skipped: boolean;

  @Column({ type: 'text', nullable: true })
  skipReason: string | null;

  @Column({ type: 'boolean', default: false })
  carriedOver: boolean;

  @Column({ type: 'date', nullable: true })
  carriedOverToDate: Date;

  @Column({ type: 'boolean', default: false })
  @Index()
  convertedToAction: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => RoutinePlanEntry, entry => entry.instances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'planEntryId' })
  planEntry: RoutinePlanEntry;
}
