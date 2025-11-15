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
import { Context } from './context.entity';
import { Project } from './project.entity';
import { ActionStatus } from './action-status.enum';

@Entity('actions')
export class Action {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('text')
  description: string;

  @Index()
  @Column({ type: 'enum', enum: ActionStatus, default: ActionStatus.INBOX })
  status: ActionStatus;

  @ManyToOne(() => Context, { nullable: true })
  @JoinColumn({ name: 'contextId' })
  context?: Context;

  @Column({ nullable: true })
  contextId?: string;

  @ManyToOne(() => Project, { nullable: true })
  @JoinColumn({ name: 'projectId' })
  project?: Project;

  @Column({ nullable: true })
  projectId?: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ nullable: true })
  waitingForPerson?: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
