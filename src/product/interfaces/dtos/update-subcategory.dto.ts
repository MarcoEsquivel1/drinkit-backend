import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsUrl,
  IsPositive,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSubCategoryDto {
  @ApiPropertyOptional({ description: 'ID de la categoría padre' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  fk_categoryId?: number;

  @ApiPropertyOptional({ description: 'Nombre de la subcategoría' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  name?: string;

  @ApiPropertyOptional({ description: 'URL de la imagen de la subcategoría' })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageSubCategory?: string;

  @ApiPropertyOptional({ description: 'Indica si la subcategoría está activa' })
  @IsOptional()
  @IsBoolean()
  activeSubCategory?: boolean;

  @ApiPropertyOptional({
    description: 'Porcentaje de descuento aplicado a la subcategoría',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  discount?: number;

  @ApiPropertyOptional({
    description: 'Indica si la subcategoría tiene envío gratis',
  })
  @IsOptional()
  @IsBoolean()
  freeDelivery?: boolean;
}
