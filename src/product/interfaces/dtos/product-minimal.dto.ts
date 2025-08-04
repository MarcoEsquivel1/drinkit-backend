import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductMinimalDto {
  @ApiProperty({ description: 'ID único del producto' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Código SKU único del producto' })
  @Expose()
  sku: string;

  @ApiProperty({ description: 'Nombre del producto' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Slug generado del producto' })
  @Expose()
  slug: string;

  @ApiProperty({ description: 'Descripción del producto' })
  @Expose()
  description: string;

  @ApiProperty({ description: 'URL de la imagen del producto' })
  @Expose()
  image?: string;

  @ApiProperty({ description: 'Precio del producto' })
  @Expose()
  price: number;

  @ApiProperty({ description: 'Indica si el producto está activo' })
  @Expose()
  active: boolean;
}
