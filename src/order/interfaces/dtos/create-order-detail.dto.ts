import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateOrderDetailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  qty: number;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @IsNotEmpty()
  fk_categoryId: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  category?: string;

  @IsInt()
  @IsNotEmpty()
  fk_subCategoryId: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  subCategory?: string;

  @IsInt()
  @IsNotEmpty()
  fk_ordersId: number;

  @IsInt()
  @IsNotEmpty()
  fk_productId: number;

  @IsInt()
  @IsNotEmpty()
  createdBy: number;

  @IsInt()
  @IsOptional()
  updatedBy?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  bonusQty?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  unityPerBox?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  envase?: number;

  @IsString()
  @IsOptional()
  presentation?: string;
}
