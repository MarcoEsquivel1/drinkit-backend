import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsString, IsInt, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ParanoidWithIdEntity } from '../../../../shared/infrastructure/database/entities/base';
import { User } from '../../../../user/infrastructure/database/entities/user.entity';
import { Product } from '../../../../product/infrastructure/database/entities/product.entity';

@Entity('carts')
export class Cart extends ParanoidWithIdEntity {
  @Column({ type: 'uuid', nullable: false, name: 'user_id' })
  @ApiProperty({ description: 'ID del usuario propietario del carrito' })
  @IsString()
  @Expose()
  userId: string;

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

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    description: 'Usuario propietario del carrito',
    type: () => User,
  })
  user: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  @ApiProperty({ description: 'Producto del carrito', type: () => Product })
  product: Product;
}
