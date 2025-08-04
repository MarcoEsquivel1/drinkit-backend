import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CartResponseDto {
  @ApiProperty({ description: 'ID único del item del carrito' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'ID del usuario propietario del carrito' })
  @Expose()
  userId: string;

  @ApiProperty({ description: 'ID del producto en el carrito' })
  @Expose()
  productId: number;

  @ApiProperty({ description: 'Cantidad del producto en el carrito' })
  @Expose()
  quantity: number;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de actualización' })
  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
