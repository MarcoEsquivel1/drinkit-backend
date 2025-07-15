import { Exclude, Expose } from 'class-transformer';

export class CouponResponseDto {
  @Expose()
  couponsId: number;

  @Expose()
  couponCode: string;

  @Expose()
  type: string;

  @Expose()
  paymentMethod: string;

  @Expose()
  value: number;

  @Expose()
  minCost: number;

  @Expose()
  remainingUses: number;

  @Expose()
  active: boolean;

  @Expose()
  startline: Date;

  @Expose()
  deadline: Date;

  @Expose()
  createdBy: number;

  @Expose()
  updatedBy: number;

  @Expose()
  usesPerUser: number;

  @Expose()
  onlyFirstOrder: boolean;

  @Expose()
  maxDiscount: number;

  @Expose()
  maxQty: number;

  @Expose()
  categories: number[];

  @Expose()
  subcategories: number[];

  @Expose()
  products: number[];

  @Expose()
  users: number[];

  @Expose()
  rules: any[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
