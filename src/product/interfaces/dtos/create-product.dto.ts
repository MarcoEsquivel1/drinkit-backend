import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsUrl,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsPositive,
  IsNotEmpty,
  ArrayMinSize,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  fk_categoryId: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  fk_subCategoryId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @Transform(({ value }) => value?.trim().toUpperCase())
  sku: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  nameProduct: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  @Transform(({ value }) => value?.trim())
  descriptionProduct: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  imageProduct?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  @Max(999999.99)
  @Type(() => Number)
  regularPrice: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(999999.99)
  @Type(() => Number)
  promotionPrice?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Type(() => Number)
  alcoholicGrade?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  weight?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  size?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  brand?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((keyword) => keyword?.trim().toLowerCase())
      : [],
  )
  keywords?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  discount?: number;

  @IsOptional()
  @IsBoolean()
  freeDelivery?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  presentation?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  business?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  channel?: string[];
}
