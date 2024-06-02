import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  id: number;

  @Column()
  category_name: string;

  @Column()
  desciption: string;

  @Column()
  transaction_type: string;

  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  @JoinColumn({ name: 'transaction_id' })
  transactions: Transaction[];
}
