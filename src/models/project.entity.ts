import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AreaOfFocus } from './area-of-focus.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @ManyToOne(() => AreaOfFocus, area => area.projects, { nullable: true })
  @JoinColumn({ name: 'areaOfFocusId' })
  areaOfFocus?: AreaOfFocus;

  @Column({ nullable: true })
  areaOfFocusId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
