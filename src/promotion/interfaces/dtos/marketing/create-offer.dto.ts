import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUrl,
  IsDateString,
  IsObject,
  IsNumber,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim())
  subtitle?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  banner?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;

  @IsDateString()
  startline: string;

  @IsDateString()
  deadline: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  freeDelivery?: boolean;

  @IsOptional()
  @IsBoolean()
  isFlashOffer?: boolean;

  @IsOptional()
  @IsObject()
  products?: any;

  @IsOptional()
  @IsObject()
  categories?: any;

  @IsOptional()
  @IsObject()
  subcategories?: any;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  createdBy: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  kit?: number;
}
