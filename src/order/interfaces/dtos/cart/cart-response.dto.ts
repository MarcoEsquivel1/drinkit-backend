import { Exclude, Expose, Type } from 'class-transformer';

export class CartResponseDto {
  @Expose()
  id: number;

  @Expose()
  fk_userId: number;

  @Expose()
  deactivatedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
