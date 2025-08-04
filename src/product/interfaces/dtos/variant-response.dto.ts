import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProductMinimalDto } from './product-minimal.dto';

export class VariantResponseDto {
  @ApiProperty({ description: 'ID único de la variante' })
  @Expose()
  variantId: number;

  @ApiProperty({ description: 'ID del producto padre' })
  @Expose()
  fk_productId: number;

  @ApiProperty({ description: 'Código SKU único de la variante' })
  @Expose()
  sku: string;

  @ApiProperty({ description: 'Nombre del producto variante' })
  @Expose()
  nameProduct: string;

  @ApiProperty({ description: 'Slug generado de la variante' })
  @Expose()
  slug: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto variante',
  })
  @Expose()
  imageProduct?: string;

  @ApiProperty({ description: 'Precio de la variante' })
  @Expose()
  price: number;

  @ApiProperty({ description: 'Indica si la variante está activa' })
  @Expose()
  active: boolean;

  @ApiPropertyOptional({ description: 'Unidades disponibles de la variante' })
  @Expose()
  units?: number;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de última actualización' })
  @Expose()
  updatedAt?: Date;

  @ApiPropertyOptional({
    description: 'Producto padre',
    type: ProductMinimalDto,
  })
  @Type(() => ProductMinimalDto)
  @Expose()
  product?: ProductMinimalDto;
}
