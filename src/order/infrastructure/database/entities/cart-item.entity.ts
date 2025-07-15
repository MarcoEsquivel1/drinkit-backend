import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import {
  IsInt,
  IsPositive,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ParanoidWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';
import { Cart } from './cart.entity';
import { Product } from '../../../../product/infrastructure/database/entities/product.entity';

@Entity('cart_items')
export class CartItem extends ParanoidWithIdEntity {
  @Column({ type: 'int', nullable: false, name: 'cart_id' })
  @ApiProperty({ description: 'ID del carrito al que pertenece el item' })
  @IsInt()
  @IsPositive()
  @Expose()
  cartId: number;

  @Column({ type: 'int', nullable: false, name: 'product_id' })
  @ApiProperty({ description: 'ID del producto en el carrito' })
  @IsInt()
  @IsPositive()
  @Expose()
  productId: number;

  @Column({ type: 'int', nullable: false })
  @ApiProperty({
    description: 'Cantidad del producto en el carrito',
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  @Expose()
  quantity: number;

  @Column({ type: 'timestamptz', nullable: true, name: 'deactivated_at' })
  @ApiPropertyOptional({ description: 'Fecha de desactivación del item' })
  @IsOptional()
  @IsDateString()
  @Expose()
  deactivatedAt?: Date;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @JoinColumn({ name: 'cart_id' })
  @ApiProperty({
    description: 'Carrito al que pertenece el item',
    type: () => Cart,
  })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({ name: 'product_id' })
  @ApiProperty({ description: 'Producto del item', type: () => Product })
  product: Product;
}
