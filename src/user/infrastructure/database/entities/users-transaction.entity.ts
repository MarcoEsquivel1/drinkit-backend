import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('usersTransactions')
export class UsersTransaction {
  @PrimaryGeneratedColumn()
  usersTransactionsId: number;

  @Column({ type: 'text', nullable: true })
  transaction: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  referenceNumber: string;

  @Column({ type: 'text', nullable: true })
  transactionStatus: string;

  @Column({ type: 'text', nullable: true })
  paymentMethod: string;

  @Column({ type: 'timestamp', nullable: true })
  transactionDate: Date;

  @Column({ type: 'text', nullable: true })
  currency: string;

  @Column({ type: 'int', nullable: false })
  fk_usersId: number;

  @Column({ type: 'int', nullable: false })
  createdBy: number;

  @Column({ type: 'int', nullable: true })
  updatedBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'fk_usersId' })
  user: User;
}
