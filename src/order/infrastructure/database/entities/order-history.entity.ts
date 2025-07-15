import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('ordersHistories')
export class OrderHistory {
  @PrimaryGeneratedColumn()
  ordersHistoriesId: number;

  @Column({ type: 'int', nullable: false })
  fk_ordersId: number;

  @Column({ type: 'varchar', nullable: false })
  status: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @Column({ type: 'int', nullable: false })
  createdBy: number;

  @Column({ type: 'int', nullable: true })
  updatedBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Order, (order) => order.orderHistories)
  @JoinColumn({ name: 'fk_ordersId' })
  order: Order;
}
