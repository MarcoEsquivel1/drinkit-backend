import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CountryResponseDto {
  @ApiProperty({ description: 'ID único del país' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nombre del país' })
  @Expose()
  name: string;

  @ApiPropertyOptional({ description: 'Código ISO2 del país' })
  @Expose()
  iso2?: string;

  @ApiPropertyOptional({ description: 'Código ISO3 del país' })
  @Expose()
  iso3?: string;

  @ApiPropertyOptional({ description: 'Código telefónico del país' })
  @Expose()
  phoneCode?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @Expose()
  updatedAt: Date;
}
