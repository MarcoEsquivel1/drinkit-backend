import { Exclude, Expose } from 'class-transformer';

export class CartItemResponseDto {
  @Expose()
  id: number;

  @Expose()
  fk_cartId: number;

  @Expose()
  fk_productId: number;

  @Expose()
  quantity: number;

  @Expose()
  deactivatedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
