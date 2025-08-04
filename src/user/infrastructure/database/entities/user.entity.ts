import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseCustomerEntity } from '../../../../shared/infrastructure/database/entities/base';
import { Role } from './role.entity';
import { UsersAddress } from './users-address.entity';
import { UsersDevice } from './users-device.entity';
import { UsersFavorite } from './users-favorite.entity';
import { UsersInvoice } from './users-invoice.entity';
import { UsersRequest } from './users-request.entity';
import { UsersTransaction } from './users-transaction.entity';
import { Cart } from '../../../../order/infrastructure/database/entities/cart.entity';
import { Order } from '../../../../order/infrastructure/database/entities/order.entity';
import { CouponUsage } from '../../../../promotion/infrastructure/database/entities/coupon-usage.entity';

@Entity('users')
export class User extends BaseCustomerEntity {
  @Column({ type: 'timestamptz', nullable: true })
  @IsOptional()
  @IsDateString()
  @Expose()
  birthdate?: Date;

  @Column({ type: 'varchar', nullable: true, name: 'facebook_id' })
  @IsOptional()
  @IsString()
  @Expose()
  facebookId?: string;

  @Column({ type: 'varchar', nullable: true, name: 'google_id' })
  @IsOptional()
  @IsString()
  @Expose()
  googleId?: string;

  @Column({ type: 'varchar', nullable: true, name: 'apple_id' })
  @IsOptional()
  @IsString()
  @Expose()
  appleId?: string;

  @Column({ type: 'integer', default: 3, name: 'fk_role_id' })
  roleId?: number;

  @Column({ type: 'boolean', default: false, name: 'is_logged_in' })
  @IsBoolean()
  @Expose()
  isLoggedIn?: boolean;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  @Expose()
  verify?: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'fk_role_id' })
  role: Role;

  @OneToMany(() => UsersAddress, (address) => address.user)
  addresses: UsersAddress[];

  @OneToMany(() => UsersDevice, (device) => device.user)
  devices: UsersDevice[];

  @OneToMany(() => UsersFavorite, (favorite) => favorite.user)
  favorites: UsersFavorite[];

  @OneToMany(() => UsersInvoice, (invoice) => invoice.user)
  invoices: UsersInvoice[];

  @OneToMany(() => UsersRequest, (request) => request.user)
  requests: UsersRequest[];

  @OneToMany(() => UsersTransaction, (transaction) => transaction.user)
  transactions: UsersTransaction[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => CouponUsage, (couponUsage) => couponUsage.user)
  couponUsages: CouponUsage[];
}
