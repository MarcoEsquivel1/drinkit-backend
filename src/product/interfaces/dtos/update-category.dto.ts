import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  IsUrl,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'Nombre de la categoría',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  name?: string;

  @ApiPropertyOptional({ description: 'URL de la imagen de la categoría' })
  @IsOptional()
  @IsString()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional({ description: 'Indica si la categoría está activa' })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Porcentaje de descuento aplicado a la categoría',
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
    description: 'Indica si la categoría tiene envío gratis',
  })
  @IsOptional()
  @IsBoolean()
  freeDelivery?: boolean;
}
