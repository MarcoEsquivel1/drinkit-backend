import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProductMinimalDto } from './product-minimal.dto';
import { SubCategoryMinimalDto } from './subcategory-minimal.dto';

export class CategoryResponseDto {
  @ApiProperty({ description: 'ID único de la categoría' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Nombre de la categoría' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Slug generado de la categoría' })
  @Expose()
  slug: string;

  @ApiPropertyOptional({ description: 'URL de la imagen de la categoría' })
  @Expose()
  image?: string;

  @ApiProperty({ description: 'Indica si la categoría está activa' })
  @Expose()
  active: boolean;

  @ApiProperty({
    description: 'Porcentaje de descuento aplicado a la categoría',
  })
  @Expose()
  discount: number;

  @ApiProperty({ description: 'Indica si la categoría tiene envío gratis' })
  @Expose()
  freeDelivery: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de última actualización' })
  @Expose()
  updatedAt?: Date;

  @ApiPropertyOptional({
    description: 'Productos de la categoría',
    type: ProductMinimalDto,
    isArray: true,
  })
  @Type(() => ProductMinimalDto)
  @Expose()
  products?: ProductMinimalDto[];

  @ApiPropertyOptional({
    description: 'Subcategorías de la categoría',
    type: SubCategoryMinimalDto,
    isArray: true,
  })
  @Type(() => SubCategoryMinimalDto)
  @Expose()
  subcategories?: SubCategoryMinimalDto[];
}
