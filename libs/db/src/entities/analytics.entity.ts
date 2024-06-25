import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Analytics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @ManyToOne(() => User, (user) => user.analytics)
  user: User;

  @Column()
  year: number;

  @Column()
  month: number;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
