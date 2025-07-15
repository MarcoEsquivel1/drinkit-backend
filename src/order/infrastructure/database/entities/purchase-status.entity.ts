import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderDetailHistory } from './order-detail-history.entity';

@Entity('purchaseStatuses')
export class PurchaseStatus {
  @PrimaryGeneratedColumn()
  purchaseStatusesId: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'int', nullable: false })
  createdBy: number;

  @Column({ type: 'int', nullable: true })
  updatedBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderDetailHistory, (history) => history.purchaseStatus)
  orderDetailHistories: OrderDetailHistory[];
}
