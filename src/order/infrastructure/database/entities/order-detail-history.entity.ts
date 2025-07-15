import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderDetail } from './order-detail.entity';
import { PurchaseStatus } from './purchase-status.entity';

@Entity('ordersDetailsHistories')
export class OrderDetailHistory {
  @PrimaryGeneratedColumn()
  ordersDetailsHistoriesId: number;

  @Column({ type: 'int', nullable: false })
  fk_ordersDetailsId: number;

  @Column({ type: 'int', nullable: false })
  fk_purchaseStatusesId: number;

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

  @ManyToOne(() => OrderDetail, (orderDetail) => orderDetail.detailsHistories)
  @JoinColumn({ name: 'fk_ordersDetailsId' })
  orderDetail: OrderDetail;

  @ManyToOne(
    () => PurchaseStatus,
    (purchaseStatus) => purchaseStatus.orderDetailHistories,
  )
  @JoinColumn({ name: 'fk_purchaseStatusesId' })
  purchaseStatus: PurchaseStatus;
}
