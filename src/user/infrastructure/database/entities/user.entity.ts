import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { BaseCustomerEntity } from '../../../../shared/infrastructure/database/entities/base';
import { Role } from './role.entity';
import { UsersAddress } from './users-address.entity';
import { UsersDevice } from './users-device.entity';
import { UsersFavorite } from './users-favorite.entity';
import { UsersInvoice } from './users-invoice.entity';
import { UsersRequest } from './users-request.entity';
import { UsersTransaction } from './users-transaction.entity';

@Entity('users')
export class User extends BaseCustomerEntity {
  @Column({ nullable: true })
  @IsOptional()
  @IsDateString()
  @Expose()
  birthdate?: Date;

  @Column({ nullable: true, name: 'facebook_id' })
  @IsOptional()
  @IsString()
  @Expose()
  facebookId?: string;

  @Column({ nullable: true, name: 'google_id' })
  @IsOptional()
  @IsString()
  @Expose()
  googleId?: string;

  @Column({ nullable: true, name: 'apple_id' })
  @IsOptional()
  @IsString()
  @Expose()
  appleId?: string;

  @Column({ type: 'integer', default: 3, name: 'fk_role_id' })
  roleId?: number;

  @Column({ default: false, name: 'is_logged_in' })
  @IsBoolean()
  @Expose()
  isLoggedIn?: boolean;

  @Column({ default: false })
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

  @OneToMany('Order', 'user')
  orders: any[];

  @OneToMany('Cart', 'user')
  carts: any[];

  @OneToMany('CouponUsage', 'user')
  couponUsages: any[];
}
