import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ParanoidWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';
import { User } from '../../../../user/infrastructure/database/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart extends ParanoidWithIdEntity {
  @Column({ type: 'uuid', nullable: false, name: 'user_id' })
  @ApiProperty({ description: 'ID del usuario propietario del carrito' })
  @IsString()
  @Expose()
  userId: string;

  @Column({ type: 'timestamptz', nullable: true, name: 'deactivated_at' })
  @ApiPropertyOptional({ description: 'Fecha de desactivación del carrito' })
  @IsOptional()
  @IsDateString()
  @Expose()
  deactivatedAt?: Date;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: 'Usuario propietario del carrito',
    type: () => User,
  })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  @ApiProperty({ description: 'Items del carrito', type: () => [CartItem] })
  cartItems: CartItem[];
}
