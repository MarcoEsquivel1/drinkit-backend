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

@Entity('usersInvoices')
export class UsersInvoice {
  @PrimaryGeneratedColumn()
  usersInvoicesId: number;

  @Column({ type: 'text', nullable: true })
  identifier: string;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  phone: string;

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

  @ManyToOne(() => User, (user) => user.invoices)
  @JoinColumn({ name: 'fk_usersId' })
  user: User;
}
