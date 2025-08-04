import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SubCategoryMinimalDto {
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

  @ApiProperty({ description: 'URL de la imagen de la subcategoría' })
  @Expose()
  imageSubCategory?: string;

  @ApiProperty({ description: 'Indica si la subcategoría está activa' })
  @Expose()
  activeSubCategory: boolean;
}
