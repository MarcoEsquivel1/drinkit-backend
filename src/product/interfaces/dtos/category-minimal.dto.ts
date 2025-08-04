import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CategoryMinimalDto {
  @ApiProperty({ description: 'ID único de la categoría' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Nombre de la categoría' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Slug generado de la categoría' })
  @Expose()
  slug: string;

  @ApiProperty({ description: 'URL de la imagen de la categoría' })
  @Expose()
  image?: string;

  @ApiProperty({ description: 'Indica si la categoría está activa' })
  @Expose()
  active: boolean;
}
