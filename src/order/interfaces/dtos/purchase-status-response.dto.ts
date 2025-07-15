import { Exclude, Expose } from 'class-transformer';

export class PurchaseStatusResponseDto {
  @Expose()
  purchaseStatusesId: number;

  @Expose()
  name: string;

  @Expose()
  createdBy: number;

  @Expose()
  updatedBy: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
