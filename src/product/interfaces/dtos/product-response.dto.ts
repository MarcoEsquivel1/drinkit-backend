import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CategoryMinimalDto } from './category-minimal.dto';
import { SubCategoryMinimalDto } from './subcategory-minimal.dto';
import { VariantMinimalDto } from './variant-minimal.dto';

export class ProductResponseDto {
  @ApiProperty({ description: 'ID único del producto' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'ID de la categoría del producto' })
  @Expose()
  categoryId: number;

  @ApiProperty({ description: 'ID de la subcategoría del producto' })
  @Expose()
  subcategoryId: number;

  @ApiProperty({ description: 'Código SKU único del producto' })
  @Expose()
  sku: string;

  @ApiProperty({ description: 'Nombre del producto' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Slug generado del producto' })
  @Expose()
  slug: string;

  @ApiProperty({ description: 'Descripción detallada del producto' })
  @Expose()
  description: string;

  @ApiPropertyOptional({ description: 'URL de la imagen del producto' })
  @Expose()
  image?: string;

  @ApiProperty({ description: 'Precio del producto' })
  @Expose()
  price: number;

  @ApiProperty({ description: 'Indica si el producto está activo' })
  @Expose()
  active: boolean;

  @ApiPropertyOptional({ description: 'Marca del producto' })
  @Expose()
  brand?: string;

  @ApiPropertyOptional({ description: 'Palabras clave para búsqueda' })
  @Expose()
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Fecha de desactivación del producto' })
  @Expose()
  deactivatedAt?: Date;

  @ApiProperty({ description: 'Porcentaje de descuento aplicado' })
  @Expose()
  discount: number;

  @ApiProperty({ description: 'Indica si el producto tiene envío gratis' })
  @Expose()
  freeDelivery: boolean;

  @ApiProperty({ description: 'Presentación del producto' })
  @Expose()
  presentation: string;

  @ApiProperty({ description: 'Códigos de negocio asociados' })
  @Expose()
  business: string[];

  @ApiProperty({ description: 'Canales de venta asociados' })
  @Expose()
  channel: string[];

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de última actualización' })
  @Expose()
  updatedAt?: Date;

  @ApiPropertyOptional({
    description: 'Categoría del producto',
    type: CategoryMinimalDto,
  })
  @Type(() => CategoryMinimalDto)
  @Expose()
  category?: CategoryMinimalDto;

  @ApiPropertyOptional({
    description: 'Subcategoría del producto',
    type: SubCategoryMinimalDto,
  })
  @Type(() => SubCategoryMinimalDto)
  @Expose()
  subcategory?: SubCategoryMinimalDto;

  @ApiPropertyOptional({
    description: 'Variantes del producto',
    type: VariantMinimalDto,
    isArray: true,
  })
  @Type(() => VariantMinimalDto)
  @Expose()
  variants?: VariantMinimalDto[];
}
