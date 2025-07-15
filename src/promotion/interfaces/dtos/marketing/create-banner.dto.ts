import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUrl,
  IsDateString,
  IsNumber,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsPositive,
  Min,
  IsIn,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBannerDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  clicks?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim())
  subtitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  cta?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['home', 'category', 'product', 'promotion', 'news'])
  type: string;

  @IsOptional()
  @IsDateString()
  startline?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  urlMovil?: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  createdBy: number;
}
