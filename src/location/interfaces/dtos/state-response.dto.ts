import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StateResponseDto {
  @ApiProperty({ description: 'ID único del estado' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nombre del estado/provincia' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'ID del país al que pertenece' })
  @Expose()
  countryId: number;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @Expose()
  updatedAt: Date;
}
