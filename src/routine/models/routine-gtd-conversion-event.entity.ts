import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { DailyRoutineInstance } from '@routine/models/daily-routine-instance.entity';

@Entity('routine_gtd_conversion_event')
export class RoutineGTDConversionEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  userId: string;

  @Column({ type: 'uuid', nullable: false, unique: true })
  @Index()
  instanceId: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  gtdActionId: string;

  @Column({ type: 'timestamp', nullable: false })
  convertedAt: Date;

  @Column({ type: 'text', nullable: true })
  conversionNotes: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // Relations
  @OneToOne(() => DailyRoutineInstance, instance => instance.conversionEvent, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'instanceId' })
  instance: DailyRoutineInstance;
}
