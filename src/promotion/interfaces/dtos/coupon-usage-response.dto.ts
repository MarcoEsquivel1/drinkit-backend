import { Exclude, Expose } from 'class-transformer';

export class CouponUsageResponseDto {
  @Expose()
  couponsUsagesId: number;

  @Expose()
  fk_couponsId: number;

  @Expose()
  fk_usersId: number;

  @Expose()
  createdBy: number;

  @Expose()
  updatedBy: number;

  @Expose()
  alreadyUsed: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
