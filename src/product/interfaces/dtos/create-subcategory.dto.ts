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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubCategoryDto {
  @ApiProperty({ description: 'ID de la categoría padre' })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  fk_categoryId: number;

  @ApiProperty({ description: 'Nombre de la subcategoría' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  name: string;

  @ApiPropertyOptional({ description: 'URL de la imagen de la subcategoría' })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageSubCategory?: string;

  @ApiPropertyOptional({
    description: 'Indica si la subcategoría está activa',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activeSubCategory?: boolean;

  @ApiPropertyOptional({
    description: 'Porcentaje de descuento aplicado a la subcategoría',
    minimum: 0,
    maximum: 100,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  discount?: number;

  @ApiPropertyOptional({
    description: 'Indica si la subcategoría tiene envío gratis',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  freeDelivery?: boolean;
}
