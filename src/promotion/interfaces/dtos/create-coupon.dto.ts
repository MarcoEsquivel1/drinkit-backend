import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumber,
  IsInt,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsArray,
  Min,
  Max,
  ArrayMinSize,
  IsPositive,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toString().trim().toUpperCase())
  couponCode: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['TOTAL', 'SHIPPING', 'PRODUCT'])
  @Transform(({ value }) => value?.toString().trim().toUpperCase())
  type: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['CASH', 'CARD', 'BOTH'])
  @Transform(({ value }) => value?.toString().trim().toUpperCase())
  paymentMethod: string;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minCost?: number;

  @IsInt()
  @IsOptional()
  remainingUses?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsOptional()
  @IsDateString()
  startline?: Date;

  @IsOptional()
  @IsDateString()
  deadline?: Date;

  @IsInt()
  @IsNotEmpty()
  createdBy: number;

  @IsInt()
  @IsOptional()
  updatedBy?: number;

  @IsInt()
  @IsOptional()
  usesPerUser?: number;

  @IsBoolean()
  @IsOptional()
  onlyFirstOrder?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxDiscount?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  maxQty?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  categories?: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  subcategories?: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  products?: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  users?: number[];

  @IsArray()
  @IsOptional()
  rules?: any[];
}
