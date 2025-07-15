import { Exclude, Expose } from 'class-transformer';

export class OrderResponseDto {
  @Expose()
  ordersId: number;

  @Expose()
  reference: string;

  @Expose()
  orderStatus: string;

  @Expose()
  confirmation: string;

  @Expose()
  paymentType: string;

  @Expose()
  paymentStatus: string;

  @Expose()
  total: number;

  @Expose()
  address: string;

  @Expose()
  apartment: string;

  @Expose()
  referencePoint: string;

  @Expose()
  location: string;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  shipping: number;

  @Expose()
  note: string;

  @Expose()
  balance: number;

  @Expose()
  completed: boolean;

  @Expose()
  fk_userId: number;

  @Expose()
  createdBy: number;

  @Expose()
  updatedBy: number;

  @Expose()
  coupon: string;

  @Expose()
  eta: string;

  @Expose()
  source: string;

  @Expose()
  perception: number;

  @Expose()
  comment: string;

  @Expose()
  loyalty: any[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
