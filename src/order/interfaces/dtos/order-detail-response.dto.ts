import { Exclude, Expose } from 'class-transformer';

export class OrderDetailResponseDto {
  @Expose()
  ordersDetailsId: number;

  @Expose()
  name: string;

  @Expose()
  qty: number;

  @Expose()
  image: string;

  @Expose()
  price: number;

  @Expose()
  fk_categoryId: number;

  @Expose()
  category: string;

  @Expose()
  fk_subCategoryId: number;

  @Expose()
  subCategory: string;

  @Expose()
  fk_ordersId: number;

  @Expose()
  fk_productId: number;

  @Expose()
  createdBy: number;

  @Expose()
  updatedBy: number;

  @Expose()
  bonusQty: number;

  @Expose()
  unityPerBox: number;

  @Expose()
  discount: number;

  @Expose()
  envase: number;

  @Expose()
  presentation: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
