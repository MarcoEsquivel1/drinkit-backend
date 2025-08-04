import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsUrl,
  IsPositive,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVariantDto {
  @ApiPropertyOptional({ description: 'ID del producto padre' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  fk_productId?: number;

  @ApiPropertyOptional({ description: 'Código SKU único de la variante' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(
    ({ value }) =>
      (typeof value === 'string'
        ? value.trim().toUpperCase()
        : value) as string,
  )
  sku?: string;

  @ApiPropertyOptional({ description: 'Nombre del producto variante' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  nameProduct?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto variante',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageProduct?: string;

  @ApiPropertyOptional({
    description: 'Precio de la variante',
    minimum: 0.01,
    maximum: 999999.99,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  @Max(999999.99)
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({ description: 'Indica si la variante está activa' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Unidades disponibles de la variante',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  units?: number;
}
