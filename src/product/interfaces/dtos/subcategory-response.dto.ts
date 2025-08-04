import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CategoryMinimalDto } from './category-minimal.dto';
import { ProductMinimalDto } from './product-minimal.dto';

export class SubCategoryResponseDto {
  @ApiProperty({ description: 'ID único de la subcategoría' })
  @Expose()
  subCategoryId: number;

  @ApiProperty({ description: 'ID de la categoría padre' })
  @Expose()
  fk_categoryId: number;

  @ApiProperty({ description: 'Nombre de la subcategoría' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Slug generado de la subcategoría' })
  @Expose()
  slug: string;

  @ApiPropertyOptional({ description: 'URL de la imagen de la subcategoría' })
  @Expose()
  imageSubCategory?: string;

  @ApiProperty({ description: 'Indica si la subcategoría está activa' })
  @Expose()
  activeSubCategory: boolean;

  @ApiProperty({
    description: 'Porcentaje de descuento aplicado a la subcategoría',
  })
  @Expose()
  discount: number;

  @ApiProperty({ description: 'Indica si la subcategoría tiene envío gratis' })
  @Expose()
  freeDelivery: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional({ description: 'Fecha de última actualización' })
  @Expose()
  updatedAt?: Date;

  @ApiPropertyOptional({
    description: 'Categoría padre',
    type: CategoryMinimalDto,
  })
  @Type(() => CategoryMinimalDto)
  @Expose()
  category?: CategoryMinimalDto;

  @ApiPropertyOptional({
    description: 'Productos de la subcategoría',
    type: ProductMinimalDto,
    isArray: true,
  })
  @Type(() => ProductMinimalDto)
  @Expose()
  products?: ProductMinimalDto[];
}
