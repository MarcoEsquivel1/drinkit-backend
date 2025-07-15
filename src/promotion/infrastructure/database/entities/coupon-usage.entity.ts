import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Coupon } from './coupon.entity';
import { User } from '../../../../user/infrastructure/database/entities/user.entity';

@Entity('couponsUsages')
export class CouponUsage {
  @PrimaryGeneratedColumn()
  couponsUsagesId: number;

  @Column({ type: 'int', nullable: false })
  fk_couponsId: number;

  @Column({ type: 'int', nullable: false })
  fk_usersId: number;

  @Column({ type: 'int', nullable: false })
  createdBy: number;

  @Column({ type: 'int', nullable: true })
  updatedBy: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  alreadyUsed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Coupon, (coupon) => coupon.usages)
  @JoinColumn({ name: 'fk_couponsId' })
  coupon: Coupon;

  @ManyToOne(() => User, 'couponUsages')
  @JoinColumn({ name: 'fk_usersId' })
  user: User;
}
