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
  ArrayMinSize,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'ID de la categoría del producto' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({ description: 'ID de la subcategoría del producto' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  subcategoryId?: number;

  @ApiPropertyOptional({ description: 'Código SKU único del producto' })
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

  @ApiPropertyOptional({ description: 'Nombre del producto' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  name?: string;

  @ApiPropertyOptional({ description: 'Descripción detallada del producto' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  description?: string;

  @ApiPropertyOptional({ description: 'URL de la imagen del producto' })
  @IsOptional()
  @IsString()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional({ description: 'Precio del producto' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  @Max(999999.99)
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({ description: 'Indica si el producto está activo' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({ description: 'Marca del producto' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  brand?: string;

  @ApiPropertyOptional({ description: 'Palabras clave para búsqueda' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((keyword) =>
          typeof keyword === 'string'
            ? keyword.trim().toLowerCase()
            : (keyword as string),
        )
      : [],
  )
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Porcentaje de descuento aplicado' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  discount?: number;

  @ApiPropertyOptional({
    description: 'Indica si el producto tiene envío gratis',
  })
  @IsOptional()
  @IsBoolean()
  freeDelivery?: boolean;

  @ApiPropertyOptional({ description: 'Presentación del producto' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  presentation?: string;

  @ApiPropertyOptional({ description: 'Códigos de negocio asociados' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  business?: string[];

  @ApiPropertyOptional({ description: 'Canales de venta asociados' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  channel?: string[];
}
