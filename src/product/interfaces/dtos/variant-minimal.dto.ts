import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class VariantMinimalDto {
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

  @ApiProperty({ description: 'URL de la imagen del producto variante' })
  @Expose()
  imageProduct?: string;

  @ApiProperty({ description: 'Precio de la variante' })
  @Expose()
  price: number;

  @ApiProperty({ description: 'Indica si la variante está activa' })
  @Expose()
  active: boolean;

  @ApiProperty({ description: 'Unidades disponibles de la variante' })
  @Expose()
  units?: number;
}
