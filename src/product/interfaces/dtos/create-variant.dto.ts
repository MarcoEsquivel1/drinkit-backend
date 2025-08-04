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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({ description: 'ID del producto padre' })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  fk_productId: number;

  @ApiProperty({ description: 'Código SKU único de la variante' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @Transform(
    ({ value }) =>
      (typeof value === 'string'
        ? value.trim().toUpperCase()
        : value) as string,
  )
  sku: string;

  @ApiProperty({ description: 'Nombre del producto variante' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  nameProduct: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto variante',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageProduct?: string;

  @ApiProperty({
    description: 'Precio de la variante',
    minimum: 0.01,
    maximum: 999999.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  @Max(999999.99)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({
    description: 'Indica si la variante está activa',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Unidades disponibles de la variante',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  units?: number;
}
