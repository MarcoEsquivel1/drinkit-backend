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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Nombre de la categoría', maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(
    ({ value }) => (typeof value === 'string' ? value.trim() : value) as string,
  )
  name: string;

  @ApiPropertyOptional({ description: 'URL de la imagen de la categoría' })
  @IsOptional()
  @IsString()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional({
    description: 'Indica si la categoría está activa',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Porcentaje de descuento aplicado a la categoría',
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
    description: 'Indica si la categoría tiene envío gratis',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  freeDelivery?: boolean;
}
