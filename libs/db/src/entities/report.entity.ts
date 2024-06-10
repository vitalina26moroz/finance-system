import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;

  @Column()
  year: number;

  @Column()
  month: number;

  @CreateDateColumn()
  createdAt: Date;
}
